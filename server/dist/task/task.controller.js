"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const task_service_1 = require("./task.service");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../user/get-user.decorator");
const user_entity_1 = require("../entity/user.entity");
const create_task_dto_1 = require("./dto/create-task.dto");
const append_task_dto_1 = require("./dto/append-task.dto");
const bring_down_task_dto_1 = require("./dto/bring-down-task.dto");
const boolean_validation_pipe_1 = require("../pipe/boolean-validation.pipe");
const uuid_validation_pipe_1 = require("../pipe/uuid-validation.pipe");
const not_empty_string_validation_pipe_1 = require("../pipe/not-empty-string-validation.pipe");
const utc_time_format_validation_pipe_1 = require("../pipe/utc-time-format.validation.pipe");
const append_column_dto_1 = require("./dto/append-column.dto");
const move_task_between_columns_dto_1 = require("./dto/move-task-between-columns.dto");
const create_bookmark_dto_1 = require("./dto/create-bookmark.dto");
const bring_down_bookmark_dto_1 = require("./dto/bring-down-bookmark.dto");
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    getTaskInfo(user, taskId) { }
    createTask(user, createTaskDto) { }
    copyTask(user, taskId) { }
    updateTaskTitle(user, taskId, newTitle) { }
    updateDescription(user, taskId, newDescription) { }
    updateStart(user, taskId, newStart) { }
    updateDeadline(user, taskId, newDeadline) { }
    updateMilestoneStatue(user, taskId, isMilestone) { }
    updateFinishedStatue(user, taskId, isFinished) { }
    createColumn(user, taskId, columnTitle) { }
    updateColumnTitle(user, columnId, newTitle) { }
    appendColumnBefore(user, appendColumnDto) { }
    appendColumnAfter(user, appendColumnDto) { }
    moveTaskBetweenColumns(user, moveTaskBetweenColumnsDto) { }
    deleteColumn(user, columnId) { }
    appendTaskBefore(user, appendTaskDto) { }
    appendTaskAfter(user, appendTaskDto) { }
    bringDownTask(user, bringDownDto) { }
    bringUpTask(user, taskId) { }
    invite(user, taskId, memberId) { }
    dismiss(user, taskId, memberId) { }
    getAllBookmarks(user, query) { }
    getAllBookmarkFolders(user) { }
    createBookmark(user, createBookmarkDto) { }
    bringDownBookmark(user, bringDownBookmarkDto) { }
    bringUpBookmark(user, bookmarkId) { }
    updateBookmarkTitle(user, bookmarkId, newTitle) { }
    deleteBookmark(user, bookmarkId) { }
    getAllContents(user, taskId) { }
    createContent(user, taskId) { }
    updateContent(user, contentId, content) { }
    deleteContent(user, contentId) { }
    getAllComments(user, taskId, query) { }
    createCommment(user, taskId, content) { }
    createReply(user, commentId, content) { }
    updateCommentContent(user, commentId, content) { }
    updateCommentPinStatus(user, commentId, pinned) { }
    deleteComment(user, commentId) { }
    deleteTask(user, taskId) { }
};
__decorate([
    (0, common_1.Get)("/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getTaskInfo", null);
__decorate([
    (0, common_1.Post)("/create"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createTask", null);
__decorate([
    (0, common_1.Post)("/copy/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "copyTask", null);
__decorate([
    (0, common_1.Patch)("/update/title/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("newTitle", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateTaskTitle", null);
__decorate([
    (0, common_1.Patch)("/update/description/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("newDescription", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateDescription", null);
__decorate([
    (0, common_1.Patch)("/update/start/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("newStart", utc_time_format_validation_pipe_1.UTCTimeFormatValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Date]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateStart", null);
__decorate([
    (0, common_1.Patch)("/update/deadline/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("newDeadline", utc_time_format_validation_pipe_1.UTCTimeFormatValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Date]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateDeadline", null);
__decorate([
    (0, common_1.Patch)("/update/milstone/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("isMilestone", boolean_validation_pipe_1.BooleanValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Boolean]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateMilestoneStatue", null);
__decorate([
    (0, common_1.Patch)("/update/finished/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("isFinished", boolean_validation_pipe_1.BooleanValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Boolean]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateFinishedStatue", null);
__decorate([
    (0, common_1.Post)("/create/column/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("columnTitle", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createColumn", null);
__decorate([
    (0, common_1.Patch)("/update/column/title/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("newTitle", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateColumnTitle", null);
__decorate([
    (0, common_1.Patch)("/append/before"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, append_column_dto_1.AppendColumnDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "appendColumnBefore", null);
__decorate([
    (0, common_1.Patch)("/append/after"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, append_column_dto_1.AppendColumnDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "appendColumnAfter", null);
__decorate([
    (0, common_1.Patch)("move/task/between/column"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        move_task_between_columns_dto_1.MoveTaskBetweenColumnsDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "moveTaskBetweenColumns", null);
__decorate([
    (0, common_1.Delete)("delete/column/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteColumn", null);
__decorate([
    (0, common_1.Patch)("/append/before"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, append_task_dto_1.AppendTaskDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "appendTaskBefore", null);
__decorate([
    (0, common_1.Patch)("/append/after"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, append_task_dto_1.AppendTaskDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "appendTaskAfter", null);
__decorate([
    (0, common_1.Patch)("/bring/down/task"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, bring_down_task_dto_1.BringDownTaskDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "bringDownTask", null);
__decorate([
    (0, common_1.Patch)("/bring/up/task"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)("taskId", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "bringUpTask", null);
__decorate([
    (0, common_1.Patch)("/invite/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("memberId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Array]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "invite", null);
__decorate([
    (0, common_1.Patch)("/dismiss/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("memberId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Array]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "dismiss", null);
__decorate([
    (0, common_1.Get)("/bookmark"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllBookmarks", null);
__decorate([
    (0, common_1.Get)("/bookmark/folder"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllBookmarkFolders", null);
__decorate([
    (0, common_1.Post)("/create/bookmark"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, create_bookmark_dto_1.CreateBookmarkDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createBookmark", null);
__decorate([
    (0, common_1.Patch)("/bring/down/bookmark"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, bring_down_bookmark_dto_1.BringDownBookmarkDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "bringDownBookmark", null);
__decorate([
    (0, common_1.Patch)("/bring/up/bookmark"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)("bookmarkId", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "bringUpBookmark", null);
__decorate([
    (0, common_1.Patch)("/update/bookmark/title/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("newTitle", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateBookmarkTitle", null);
__decorate([
    (0, common_1.Delete)("/delete/bookmark/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteBookmark", null);
__decorate([
    (0, common_1.Get)("/content/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllContents", null);
__decorate([
    (0, common_1.Post)("/create/content/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createContent", null);
__decorate([
    (0, common_1.Put)("/update/content/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("content")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateContent", null);
__decorate([
    (0, common_1.Delete)("/delete/content/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteContent", null);
__decorate([
    (0, common_1.Get)("/comment/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllComments", null);
__decorate([
    (0, common_1.Post)("/create/comment/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("content", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createCommment", null);
__decorate([
    (0, common_1.Post)("/create/reply/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("commentId", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("content", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createReply", null);
__decorate([
    (0, common_1.Patch)("/update/comment/content/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("content", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateCommentContent", null);
__decorate([
    (0, common_1.Patch)("/update/comment/fixed/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("pinned", boolean_validation_pipe_1.BooleanValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Boolean]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateCommentPinStatus", null);
__decorate([
    (0, common_1.Delete)("/delete/comment/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Delete)("/delete/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteTask", null);
TaskController = __decorate([
    (0, common_1.Controller)("task"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map