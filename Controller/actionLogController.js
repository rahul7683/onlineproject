
import { uploadinS3Promise } from "../Service/s3FileUploadService.js"
import  ActionLogService  from '../Service/actionLogService.js';
 
export default class ActionLogController {
  // Create a new action log
 
  static async createActionLog(req, res) {
    try {
      const logData = {
        actionBy: req.body.actionBy,
        actionName: req.body.actionName,
        actionOn: req.body.actionOn,
        actionData: req.body.actionData
      };
      const log = await ActionLogService.createLog(logData);
      res.status(201).json({
        success: true,
        message: 'Action log created successfully',
        result: log
      });
    } catch (err) {
      console.error('Error creating action log:', err);

      res.status(500).json({
        success: false,
        message: 'Failed to create action log',
        error: err.message
      });
    }
  }

  static async listActionLogs(req, res) {
    try {
      const query = req.query;
      const pagination = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10
      };
      
      const result = await ActionLogService.listLogs(query, pagination);
      res.status(200).json({
        success: true,
        message: 'Action logs retrieved successfully',
        result: result
      });
    } catch (err) {
      console.error('Error listing action logs:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve action logs',
        error: err.message
      });
    }
  }
}

//module.exports = ActionLogController;