# Cookbook Digitization
Let's use Trunk Based Development (to avoid merge conflicts)

At the Start of Your Work Session
1. Run npm install to make sure your dependencies are up to date
Create a new branch for your work.
Use a clear naming convention: feature/<name>, bugfix/<name>, hotfix/<name>.

2. Open a Pull Request (PR) from main into your branch.
This ensures your branch stays up to date with the latest trunk changes.

3. Commit as normal on your branch.
Keep commits small, focused, and with meaningful messages.

4. When you finish your session, open a PR from your branch back into main.
CI/CD pipelines will run automatically to validate your changes before merging.

Big ideas here: We work off of a stable "trunk" or main, using CI/CD pipelines to check our work before its merged. We use feature flags to hide our incomplete work from the trunk.

# What I did, for future reference
## 1. install node.js
    It's a javascript runtime environment (allows you to run javascript anywhere)
    https://nodejs.org/en/download
    get the prebuilt version
## 2. check installation in terminal
```console
    node -v
    npm -v
```
## 3. let Next do its thing, I used the default settings
no one should have to do this, when you clone this repo you're essentially doing this step already.
This will only be ran again if we need to start over, or make another website.
```console
    npx create-next-app@latest digitalcookbook
```
# How to run? 
start the server on localhost
```console
    npm run dev
```
Keep the terminal window open, copy the address to your browser to view it rendered.

# todo:
- [ ] setup tailwind DaisyUI
- [ ] setup MongoDB with Compass 
- [ ] write first tests