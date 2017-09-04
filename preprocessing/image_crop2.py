"""Crop a polygonal selection from an image."""
import numpy as np
from PIL import Image
from shapely.geometry import Point
from shapely.geometry import Polygon


im = Image.open('1.jpg').convert('RGBA')
pixels = np.array(im)
im_copy = np.array(im)

region = Polygon([(200, 200), (450, 400), (50, 550)])

for index, pixel in np.ndenumerate(pixels):
  # Unpack the index.
  row, col, channel = index
  # We only need to look at spatial pixel data for one of the four channels.
  if channel != 0:
    continue
  point = Point(row, col)
  if not region.contains(point):
    im_copy[(row, col, 0)] = 255
    im_copy[(row, col, 1)] = 255
    im_copy[(row, col, 2)] = 255
    im_copy[(row, col, 3)] = 0

cut_image = Image.fromarray(im_copy)
cut_image.save('bird.png')