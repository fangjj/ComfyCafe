# Local Installation

This assumes you're using a recent version of Ubuntu.

Keep in mind that there are two main branches: develop, the default branch that contains the latest changes, and master, the branch used in production.

```bash
sudo apt-get install git build-essential pkg-config libvips-dev ffmpeg imagemagick
curl https://install.meteor.com/ | sh
git clone https://github.com/ComfySoft/ComfyCafe.git
git checkout master # Skip this step if you want to be cutting edge.
meteor npm install
meteor
```

ComfyCafé should now be running successfully. After navigating to localhost:3000 in your browser, you'll need to register as a user. As the first user to register, you're automatically given admin priveleges. You should now be good to go.
