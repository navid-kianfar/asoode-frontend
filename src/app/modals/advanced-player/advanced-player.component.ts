import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {
  AdvancedPlayerCommentViewModel,
  AdvancedPlayerViewModel,
  WorkPackageTaskAttachmentViewModel
} from '../../view-models/projects/project-types';
import {TaskService} from '../../services/projects/task.service';
import {OperationResultStatus} from '../../library/core/enums';
import {MatVideoComponent} from 'mat-video/lib/video.component';

@Component({
  selector: 'app-advanced-player',
  templateUrl: './advanced-player.component.html',
  styleUrls: ['./advanced-player.component.scss']
})
export class AdvancedPlayerComponent
  extends SimpleModalComponent<{attachment: WorkPackageTaskAttachmentViewModel}, void>
  implements OnInit, OnDestroy, AfterViewInit {
  tempComment: AdvancedPlayerCommentViewModel;
  addingComment: boolean;
  commentWaiting: boolean;
  video: HTMLVideoElement;
  attachment: WorkPackageTaskAttachmentViewModel;
  waiting: boolean;
  data: AdvancedPlayerViewModel;
  filter: string;
  time: number;

  @ViewChild('player', {static: true}) matVideo: MatVideoComponent;

  constructor(
    private readonly taskService: TaskService
  ) { super(); }

  ngOnInit() {
    this.addingComment = false;
    this.filter = '';
    this.data = {comments: [], shapes: []};
    this.fetch();
  }

  ngAfterViewInit() {
    this.video = this.matVideo.getVideoTag();
    this.video.addEventListener('timeupdate', (e) => console.log(this.video.currentTime));
    this.video.addEventListener('onseeked', (e) => console.log(this.video.currentTime));
  }

  async fetch() {
    this.waiting = true;
    const op = await this.taskService.advancedPlayer(this.attachment.id);
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      this.close();
      return;
    }
    this.data = op.data;
  }

  newComment() {
    this.video.pause();
    this.addingComment = true;
    this.tempComment = {
      id: undefined,
      updatedAt: undefined,
      createdAt: undefined,
      attachmentId: this.attachment.id,
      endFrame: 0,
      startFrame: 0,
      payload: null,
      message: ''
    };
  }

  async saveComment() {
    const message = this.tempComment.message.trim();
    if (!message) { return; }
    this.commentWaiting = true;
    const op = await this.taskService.advancedPlayerComment(this.attachment.id, {
      message,
      startFrame: Math.round(this.video.currentTime)
    });
    this.commentWaiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.data.comments.push(op.data);
    this.sort();
    this.addingComment = false;
  }

  sort() {
    this.data.comments = this.data.comments.sort((a, b) => {
      if (a.startFrame < b.startFrame) { return -1; }
      if (a.startFrame > b.startFrame) { return 1; }
      return 0;
    });
  }

  exportPdf() {

  }

  drawPicture() {

  }

  drawArrow() {

  }

  drawCircle() {

  }

  drawRectangle() {

  }

  useEraser() {

  }

  useBrush() {

  }

  goToComment(comment: AdvancedPlayerCommentViewModel) {
    this.video.currentTime = comment.startFrame;
  }

  editComment(comment: AdvancedPlayerCommentViewModel) {
    this.tempComment = {} as any;
    Object.assign(this.tempComment, comment);
  }
}
