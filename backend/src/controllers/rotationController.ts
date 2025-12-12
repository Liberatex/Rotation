import { Response } from 'express';
import { pool } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

class RotationController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { sessionId, name, timerDuration, turnOrder, customSettings } = req.body;

      // Verify user is participant in session
      const participantCheck = await pool.query(
        'SELECT id FROM session_participants WHERE session_id = $1 AND user_id = $2',
        [sessionId, userId]
      );

      if (participantCheck.rows.length === 0) {
        throw new AppError('Not a participant in this session', 403);
      }

      // Get participants if turnOrder not provided
      let finalTurnOrder = turnOrder;
      if (!finalTurnOrder || finalTurnOrder.length === 0) {
        const participantsResult = await pool.query(
          'SELECT user_id FROM session_participants WHERE session_id = $1 ORDER BY join_order',
          [sessionId]
        );
        finalTurnOrder = participantsResult.rows.map((p: any) => p.user_id);
      }

      const result = await pool.query(
        `INSERT INTO rotations (session_id, name, timer_duration, turn_order, custom_settings, status)
         VALUES ($1, $2, $3, $4, $5, 'waiting')
         RETURNING *`,
        [
          sessionId,
          name || null,
          timerDuration || 30,
          JSON.stringify(finalTurnOrder),
          JSON.stringify(customSettings || {}),
        ]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create rotation', 500);
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await pool.query('SELECT * FROM rotations WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        throw new AppError('Rotation not found', 404);
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get rotation', 500);
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const { name, timerDuration, turnOrder, customSettings } = req.body;

      // Check if user is MBA of session
      const rotationResult = await pool.query(
        `SELECT r.*, s.master_blunt_agent_id 
         FROM rotations r
         JOIN sessions s ON r.session_id = s.id
         WHERE r.id = $1`,
        [id]
      );

      if (rotationResult.rows.length === 0) {
        throw new AppError('Rotation not found', 404);
      }

      if (rotationResult.rows[0].master_blunt_agent_id !== userId) {
        throw new AppError('Only Master Blunt Agent can update rotation', 403);
      }

      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramCount++}`);
        values.push(name);
      }

      if (timerDuration !== undefined) {
        updates.push(`timer_duration = $${paramCount++}`);
        values.push(timerDuration);
      }

      if (turnOrder !== undefined) {
        updates.push(`turn_order = $${paramCount++}`);
        values.push(JSON.stringify(turnOrder));
      }

      if (customSettings !== undefined) {
        updates.push(`custom_settings = $${paramCount++}`);
        values.push(JSON.stringify(customSettings));
      }

      if (updates.length === 0) {
        throw new AppError('No fields to update', 400);
      }

      values.push(id);

      const updateResult = await pool.query(
        `UPDATE rotations SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
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
      throw new AppError('Failed to update rotation', 500);
    }
  }

  async start(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      // Check if user is MBA
      const rotationResult = await pool.query(
        `SELECT r.*, s.master_blunt_agent_id 
         FROM rotations r
         JOIN sessions s ON r.session_id = s.id
         WHERE r.id = $1`,
        [id]
      );

      if (rotationResult.rows.length === 0) {
        throw new AppError('Rotation not found', 404);
      }

      if (rotationResult.rows[0].master_blunt_agent_id !== userId) {
        throw new AppError('Only Master Blunt Agent can start rotation', 403);
      }

      const rotation = rotationResult.rows[0];
      const turnOrder = JSON.parse(rotation.turn_order);

      if (turnOrder.length === 0) {
        throw new AppError('No participants in rotation', 400);
      }

      const firstUserId = turnOrder[0];

      // Start rotation
      await pool.query(
        `UPDATE rotations 
         SET status = 'active', 
             current_turn_user_id = $1, 
             current_turn_started_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [firstUserId, id]
      );

      // Create turn record
      await pool.query(
        `INSERT INTO rotation_turns (rotation_id, user_id, turn_number, started_at)
         VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
         RETURNING *`,
        [id, firstUserId]
      );

      // Log history
      await pool.query(
        `INSERT INTO rotation_history (rotation_id, user_id, action, metadata)
         VALUES ($1, $2, 'start', '{}')`,
        [id, userId]
      );

      res.json({
        success: true,
        message: 'Rotation started',
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to start rotation', 500);
    }
  }

  async pause(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      // Check if user is MBA
      const rotationResult = await pool.query(
        `SELECT r.*, s.master_blunt_agent_id 
         FROM rotations r
         JOIN sessions s ON r.session_id = s.id
         WHERE r.id = $1`,
        [id]
      );

      if (rotationResult.rows.length === 0) {
        throw new AppError('Rotation not found', 404);
      }

      if (rotationResult.rows[0].master_blunt_agent_id !== userId) {
        throw new AppError('Only Master Blunt Agent can pause rotation', 403);
      }

      await pool.query(
        `UPDATE rotations SET status = 'paused', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      );

      await pool.query(
        `INSERT INTO rotation_history (rotation_id, user_id, action) VALUES ($1, $2, 'pause')`,
        [id, userId]
      );

      res.json({
        success: true,
        message: 'Rotation paused',
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to pause rotation', 500);
    }
  }

  async resume(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      // Check if user is MBA
      const rotationResult = await pool.query(
        `SELECT r.*, s.master_blunt_agent_id 
         FROM rotations r
         JOIN sessions s ON r.session_id = s.id
         WHERE r.id = $1`,
        [id]
      );

      if (rotationResult.rows.length === 0) {
        throw new AppError('Rotation not found', 404);
      }

      if (rotationResult.rows[0].master_blunt_agent_id !== userId) {
        throw new AppError('Only Master Blunt Agent can resume rotation', 403);
      }

      await pool.query(
        `UPDATE rotations SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      );

      await pool.query(
        `INSERT INTO rotation_history (rotation_id, user_id, action) VALUES ($1, $2, 'resume')`,
        [id, userId]
      );

      res.json({
        success: true,
        message: 'Rotation resumed',
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to resume rotation', 500);
    }
  }

  async end(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      // Check if user is MBA
      const rotationResult = await pool.query(
        `SELECT r.*, s.master_blunt_agent_id 
         FROM rotations r
         JOIN sessions s ON r.session_id = s.id
         WHERE r.id = $1`,
        [id]
      );

      if (rotationResult.rows.length === 0) {
        throw new AppError('Rotation not found', 404);
      }

      if (rotationResult.rows[0].master_blunt_agent_id !== userId) {
        throw new AppError('Only Master Blunt Agent can end rotation', 403);
      }

      // End current turn if active
      const rotation = rotationResult.rows[0];
      if (rotation.current_turn_user_id && rotation.current_turn_started_at) {
        const startedAt = new Date(rotation.current_turn_started_at);
        const durationMs = Date.now() - startedAt.getTime();

        await pool.query(
          `UPDATE rotation_turns 
           SET ended_at = CURRENT_TIMESTAMP, duration_ms = $1
           WHERE rotation_id = $2 AND ended_at IS NULL`,
          [durationMs, id]
        );
      }

      await pool.query(
        `UPDATE rotations 
         SET status = 'completed', 
             current_turn_user_id = NULL,
             current_turn_started_at = NULL,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [id]
      );

      await pool.query(
        `INSERT INTO rotation_history (rotation_id, user_id, action) VALUES ($1, $2, 'end')`,
        [id, userId]
      );

      res.json({
        success: true,
        message: 'Rotation ended',
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to end rotation', 500);
    }
  }

  async pass(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const rotationResult = await pool.query(
        'SELECT * FROM rotations WHERE id = $1',
        [id]
      );

      if (rotationResult.rows.length === 0) {
        throw new AppError('Rotation not found', 404);
      }

      const rotation = rotationResult.rows[0];

      if (rotation.current_turn_user_id !== userId) {
        throw new AppError('Not your turn', 403);
      }

      if (rotation.status !== 'active') {
        throw new AppError('Rotation is not active', 400);
      }

      // End current turn
      const startedAt = new Date(rotation.current_turn_started_at!);
      const durationMs = Date.now() - startedAt.getTime();

      await pool.query(
        `UPDATE rotation_turns 
         SET ended_at = CURRENT_TIMESTAMP, duration_ms = $1
         WHERE rotation_id = $2 AND ended_at IS NULL`,
        [durationMs, id]
      );

      // Get next user
      const turnOrder = JSON.parse(rotation.turn_order);
      const currentIndex = turnOrder.indexOf(userId);
      const nextIndex = (currentIndex + 1) % turnOrder.length;
      const nextUserId = turnOrder[nextIndex];
      const turnNumber = Math.floor((currentIndex + 1) / turnOrder.length) + 1;

      // Start next turn
      await pool.query(
        `UPDATE rotations 
         SET current_turn_user_id = $1, 
             current_turn_started_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [nextUserId, id]
      );

      // Create new turn record
      await pool.query(
        `INSERT INTO rotation_turns (rotation_id, user_id, turn_number, started_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [id, nextUserId, turnNumber]
      );

      // Log history
      await pool.query(
        `INSERT INTO rotation_history (rotation_id, user_id, action, metadata)
         VALUES ($1, $2, 'pass', '{"passed_to": $3}')`,
        [id, userId, nextUserId]
      );

      res.json({
        success: true,
        message: 'Turn passed',
        data: { nextUserId },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to pass turn', 500);
    }
  }

  async getTurns(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT rt.*, up.display_name, up.avatar_url
         FROM rotation_turns rt
         JOIN user_profiles up ON rt.user_id = up.user_id
         WHERE rt.rotation_id = $1
         ORDER BY rt.turn_number, rt.started_at`,
        [id]
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      throw new AppError('Failed to get turns', 500);
    }
  }

  async getHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT rh.*, up.display_name
         FROM rotation_history rh
         LEFT JOIN user_profiles up ON rh.user_id = up.user_id
         WHERE rh.rotation_id = $1
         ORDER BY rh.timestamp DESC`,
        [id]
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      throw new AppError('Failed to get history', 500);
    }
  }
}

export const rotationController = new RotationController();

