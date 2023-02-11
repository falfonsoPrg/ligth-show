from PIL import Image
im = Image.open('cat five by five (2).jpg', 'r')
width, height = im.size
pixel_values = list(im.getdata())
print(pixel_values)
print(len(pixel_values))
