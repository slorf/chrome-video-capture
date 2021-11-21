export class VideoCapture {
  private mediaRecorder: MediaRecorder = null;
  private title: string = null;
  private recordedBlobs: Blob[] = [];

  constructor($source: HTMLVideoElement) {
    // validation
    if ($source.tagName !== 'VIDEO') {
      throw new Error('source must be a html video element');
    }

    this.title = VideoCapture.getTitle($source);

    const stream = $source.captureStream();
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
    this.mediaRecorder.onerror = this.handleError.bind(this);
  }

  static getTitle(video: HTMLVideoElement): string {
    if (video.title) {
      return video.title;
    }
    // check if there's a `title` data attribute
    const dataTitle = Object.entries(video.dataset)
      .map(([attrName, attrValue]) => {
        if (attrValue && attrName.toLowerCase().includes('title')) {
          return attrValue;
        }
      })
      .find((title) => title);
    return dataTitle || document.title || 'video';
  }

  start(timeslice: number = 1000) {
    this.mediaRecorder.start(timeslice);
  }

  stop(canceled: boolean) {
    if (this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (!canceled) {
      this.download();
    }
  }

  private handleDataAvailable(event: BlobEvent) {
    if (event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data);
    }
  }

  private handleError(error: any) {
    throw new Error(error);
  }

  private download() {
    // create downloadable video blob
    const blob: Blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
    const url: string = window.URL.createObjectURL(blob);

    // trigger download
    const a: HTMLAnchorElement = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${this.title}.webm`;
    document.body.appendChild(a);
    a.click();

    // cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}
