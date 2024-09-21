
import  Actionlog  from "../Modal/actionLogModal.js";
//console.log('ActionLog:', ActionLog)
export default class ActionLogService {
  // Create a new action log
  static async createLog(logData) {
    try {
      const log = new Actionlog(logData);
      return await log.save();
    } catch (err) {
      throw new Error('Error creating action log: ' + err.message);
    }
  }

  static async listLogs(query, pagination){
    try {
      const { page = 1, limit = 10 } = pagination;
      const filter = {};

      if (query.actionBy) {
        filter.actionBy = query.actionBy;
      }
      if (query.actionName) {
        filter.actionName = query.actionName;
      }
      if (query.actionOn) {
        filter.actionOn = query.actionOn;
      }

      
      const logs = await Actionlog.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .exec();

      const totalLogs = await Actionlog.countDocuments(filter).exec();
      return {
        logs,
        totalLogs,
        totalPages: Math.ceil(totalLogs / limit),
        currentPage: Number(page)
      };
    } catch (err) {
      throw new Error('Error listing action logs: ' + err.message);
    }
  }
}

//module.exports = ActionLogService;