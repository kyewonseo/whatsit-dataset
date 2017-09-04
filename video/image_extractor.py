from __future__ import unicode_literals

from moviepy.editor import *
from moviepy.video.fx.resize import resize
import argparse
import os
import shutil
import youtube_dl


# import imageio

# imageio.plugins.ffmpeg.download()

TMP_DIR = '/tmp/youtube'
TMP_FILENAME = 'video.mp4'

TMP_OUT_DIR = '/tmp/youtube/out'

video_file = ''
out_dir = ''
downloaded = False

def main():
    global  out_dir
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--file', type=str, default='',
                        help='video file e.g. test.mp4')
    parser.add_argument('--url', type=str, default='',
                        help='video link  e.g. https://www.youtube.com/watch?v=xxxxx')
    parser.add_argument('--out_dir', type=str, default='',
                        help='')
    args = parser.parse_args()

    if args.out_dir is not '':
        out_dir = args.out_dir
    else:
        out_dir = TMP_OUT_DIR

    if args.url is not '':
        download_youtube(args.url)
    elif args.file is not '':
        extract_image_from_video(args.file)



def clean_setup():
    if os.path.exists(TMP_DIR):
        shutil.rmtree(TMP_DIR)
    os.makedirs(TMP_DIR)

    if os.path.exists(TMP_OUT_DIR):
        shutil.rmtree(TMP_OUT_DIR)
    os.makedirs(TMP_OUT_DIR)

def my_hook(d):
    global downloaded
    if d['status'] == 'finished':
        if downloaded is False:
            downloaded = True
            extract_image_from_video(d['filename'])

def download_youtube(url):
    ydl_opts = {
        'outtmpl': TMP_DIR + '/' + TMP_FILENAME,
        'progress_hooks': [my_hook]
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

def extract_image_from_video(video):
    global out_dir
    if os.path.exists(out_dir):
        shutil.rmtree(out_dir)
    os.makedirs(out_dir)

    clip = VideoFileClip(video).resize(width=1024)

    duration = int(clip.duration)
    for i in range(0, duration):
        filename = out_dir + '/' + str(i) + ".jpg"
        clip.save_frame(filename, i)


if __name__ == '__main__':
    clean_setup()
    main()
