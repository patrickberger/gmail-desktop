import { WebContents } from 'electron';

/**
 * Wraps the main window's webContents and sends messages to be displayed in the snackbar.
 *
 * @export
 * @class SnackbarMessenger
 */
export class ToastMessenger {

  private target: WebContents;

  constructor(target: WebContents) {
    this.target = target;
  }

  public confirm(message: string, title?: string): void {
    this.sendMessage('confirm', message, title);
  }

  public info(message: string, title?: string): void {
    this.sendMessage('info', message, title);
  }

  private sendMessage(
    type: string,
    message: string,
    title?: string,
  ): void {
    this.target.send('toast-message', {type, message, title});
  }

}
