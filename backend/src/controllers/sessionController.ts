import { Response } from 'express';
import { pool } from '../config/database';
import { generateSessionCode } from '../utils/sessionCode';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

class SessionController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { settings } = req.body;

      // Generate unique session code
      let code = generateSessionCode();
      let codeExists = true;
      
      while (codeExists) {
        const check = await pool.query('SELECT id FROM sessions WHERE code = $1', [code]);
        if (check.rows.length > 0) {
          code = generateSessionCode();
        } else {
          codeExists = false;
        }
      }

      // Create session
      const sessionResult = await pool.query(
        `INSERT INTO sessions (code, master_blunt_agent_id, status, settings)
         VALUES ($1, $2, 'waiting', $3)
         RETURNING id, code, master_blunt_agent_id, status, settings, created_at`,
        [code, userId, JSON.stringify(settings || {})]
      );

      const session = sessionResult.rows[0];

      // Add creator as first participant
      await pool.query(
        'INSERT INTO session_participants (session_id, user_id, join_order) VALUES ($1, $2, 1)',
        [session.id, userId]
      );

      res.status(201).json({
        success: true,
        data: session,
      });
    } catch (error) {
      throw new AppError('Failed to create session', 500);
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      // Get session with participants
      const sessionResult = await pool.query(
        `SELECT s.*, 
                json_agg(json_build_object(
                  'id', sp.id,
                  'user_id', sp.user_id,
                  'join_order', sp.join_order,
                  'joined_at', sp.joined_at
                )) as participants
         FROM sessions s
         LEFT JOIN session_participants sp ON s.id = sp.session_id
         WHERE s.id = $1
         GROUP BY s.id`,
        [id]
      );

      if (sessionResult.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      // Check if user is participant
      const participantCheck = await pool.query(
        'SELECT id FROM session_participants WHERE session_id = $1 AND user_id = $2',
        [id, userId]
      );

      if (participantCheck.rows.length === 0) {
        throw new AppError('Not authorized to view this session', 403);
      }

      res.json({
        success: true,
        data: sessionResult.rows[0],
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get session', 500);
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const { settings, status } = req.body;

      // Check if user is MBA
      const sessionResult = await pool.query(
        'SELECT master_blunt_agent_id FROM sessions WHERE id = $1',
        [id]
      );

      if (sessionResult.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      if (sessionResult.rows[0].master_blunt_agent_id !== userId) {
        throw new AppError('Only Master Blunt Agent can update session', 403);
      }

      // Update session
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (settings) {
        updates.push(`settings = $${paramCount++}`);
        values.push(JSON.stringify(settings));
      }

      if (status) {
        updates.push(`status = $${paramCount++}`);
        values.push(status);
      }

      if (updates.length === 0) {
        throw new AppError('No fields to update', 400);
      }

      values.push(id);

      const updateResult = await pool.query(
        `UPDATE sessions SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      res.json({
        success: true,
        data: updateResult.rows[0],
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update session', 500);
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      // Check if user is MBA
      const sessionResult = await pool.query(
        'SELECT master_blunt_agent_id FROM sessions WHERE id = $1',
        [id]
      );

      if (sessionResult.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      if (sessionResult.rows[0].master_blunt_agent_id !== userId) {
        throw new AppError('Only Master Blunt Agent can delete session', 403);
      }

      await pool.query('DELETE FROM sessions WHERE id = $1', [id]);

      res.json({
        success: true,
        message: 'Session deleted successfully',
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete session', 500);
    }
  }

  async join(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const { code } = req.body;

      // Verify session code if provided
      if (code) {
        const sessionCheck = await pool.query(
          'SELECT id FROM sessions WHERE id = $1 AND code = $2',
          [id, code]
        );

        if (sessionCheck.rows.length === 0) {
          throw new AppError('Invalid session code', 400);
        }
      }

      // Check if already participant
      const existingParticipant = await pool.query(
        'SELECT id FROM session_participants WHERE session_id = $1 AND user_id = $2',
        [id, userId]
      );

      if (existingParticipant.rows.length > 0) {
        res.json({
          success: true,
          message: 'Already a participant',
        });
        return;
      }

      // Get next join order
      const orderResult = await pool.query(
        'SELECT COALESCE(MAX(join_order), 0) + 1 as next_order FROM session_participants WHERE session_id = $1',
        [id]
      );

      const joinOrder = orderResult.rows[0].next_order;

      // Add participant
      await pool.query(
        'INSERT INTO session_participants (session_id, user_id, join_order) VALUES ($1, $2, $3)',
        [id, userId, joinOrder]
      );

      res.json({
        success: true,
        message: 'Joined session successfully',
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to join session', 500);
    }
  }

  async leave(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      await pool.query(
        'DELETE FROM session_participants WHERE session_id = $1 AND user_id = $2',
        [id, userId]
      );

      res.json({
        success: true,
        message: 'Left session successfully',
      });
    } catch (error) {
      throw new AppError('Failed to leave session', 500);
    }
  }

  async getParticipants(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT sp.*, up.display_name, up.avatar_url
         FROM session_participants sp
         JOIN user_profiles up ON sp.user_id = up.user_id
         WHERE sp.session_id = $1
         ORDER BY sp.join_order`,
        [id]
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      throw new AppError('Failed to get participants', 500);
    }
  }

  async addParticipant(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId: targetUserId } = req.body;
      const userId = req.user!.userId;

      // Check if user is MBA
      const sessionResult = await pool.query(
        'SELECT master_blunt_agent_id FROM sessions WHERE id = $1',
        [id]
      );

      if (sessionResult.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      if (sessionResult.rows[0].master_blunt_agent_id !== userId) {
        throw new AppError('Only Master Blunt Agent can add participants', 403);
      }

      // Get next join order
      const orderResult = await pool.query(
        'SELECT COALESCE(MAX(join_order), 0) + 1 as next_order FROM session_participants WHERE session_id = $1',
        [id]
      );

      const joinOrder = orderResult.rows[0].next_order;

      await pool.query(
        'INSERT INTO session_participants (session_id, user_id, join_order) VALUES ($1, $2, $3)',
        [id, targetUserId, joinOrder]
      );

      res.json({
        success: true,
        message: 'Participant added successfully',
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to add participant', 500);
    }
  }

  async removeParticipant(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id, userId: targetUserId } = req.params;
      const userId = req.user!.userId;

      // Check if user is MBA
      const sessionResult = await pool.query(
        'SELECT master_blunt_agent_id FROM sessions WHERE id = $1',
        [id]
      );

      if (sessionResult.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      if (sessionResult.rows[0].master_blunt_agent_id !== userId) {
        throw new AppError('Only Master Blunt Agent can remove participants', 403);
      }

      await pool.query(
        'DELETE FROM session_participants WHERE session_id = $1 AND user_id = $2',
        [id, targetUserId]
      );

      res.json({
        success: true,
        message: 'Participant removed successfully',
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to remove participant', 500);
    }
  }
}

export const sessionController = new SessionController();

