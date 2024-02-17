import os
import base64
import requests

# Function to convert image to base64
def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Get a list of all jpeg files in the current directory
# jpeg_files = [f for f in os.listdir('/root/Aura/Craiyon/craiyon-website/public/images') if os.path.isfile(f) and f.endswith('.jpeg')]

# URL to send the POST request to
url = 'https://62etifevx7ft3i72nmavnfsrsu0thgvs.lambda-url.us-east-1.on.aws/'

# # Loop through each file, convert it to base64, and send a POST request
images = [f"{n}.png" for n in range(1, 10)]
for image in images:
    print(image)
    image_base64 = image_to_base64(image)
    headers = {'Content-Type': 'application/json'}
    data = {'img': image_base64,"dims":256}
    response = requests.post(url, headers=headers, json=data)

        # Print the response (or do whatever you need with it)
    with open(f"{image}.txt", "w") as f:
        print(response.text, file=f)
    # print(response.text)
