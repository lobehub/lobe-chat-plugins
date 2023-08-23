# This is the Plugin Index of Lobe Chat

[Lobe Chat](https://github.com/lobehub/lobe-chat) accesses [`index.json`](https://registry.npmmirror.com/@lobehub/lobe-chat-plugins/latest/files) from this repo to show user the list of available plugins.

## How to submit plugin

If you wish to add a plugin onto the index, make an entry in `plugins` directory using `plugin_template.json`, write a short description and tag it appropriately then open as a pull request ty!

### Step by step instructions

1. Fork of this repository.

2. Make a copy of `plugin_template.json`

3. Fill in the copy and rename it appropriately

4. Move it into `plugins` directory

5. Submit a pull request and wait for review.

- Plugins pull requests targets [`plugins branch`](https://github.com/@lobehub/lobe-chat-plugins/tree/plugins), after merge it is automatically assembled and deployed to [`master branch`](https://github.com/@lobehub/lobe-chat-plugins/tree/master) using GitHub Actions.

- Don't edit the `index.json` directly and don't modify any other files unless you have a special reason.

- The `added` date will be automatically populated after merge.

## Tags

A list of available `tags` and their description can be found at in `tags.json`

- `online` tag is **Required** for any plugin that connections to external server during regular use aside from one time downloading of assets.

- `ads` tag is **Required** for any plugin that contains advertisements or self-advertisement in the plugin itself.

- `localization` tag is for localization files only, not for plugin that adds localization functionalities such as translator.

- `installed` tag it is used internally by webui, it is not meant to be used for plugin categorization.

## Notes

- An plugin will need to be functioning for it to be included.

- If plugin is no longer functional and or not maintained, we might redirect it to a fork or remove it form the index.

- Not all plugins will be accepted, we will review the plugin and make an assessment.

- You can submit plugins even if you are not the author, but it is preferred that the author do it themselves.

- If you wish to have your plugin removed, or believes the description does not properly describe your plugin, please open the issue or pull request.
