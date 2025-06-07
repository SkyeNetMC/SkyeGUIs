# SkyeGUI

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Minecraft](https://img.shields.io/badge/minecraft-1.21-green.svg)
![License](https://img.shields.io/badge/license-Custom-red.svg)

A standalone GUI plugin for creating custom inventory-based interfaces in Minecraft servers using Paper/Spigot.

## Features

- 🎨 **Custom GUI Creation** - Create fully customizable inventory-based GUIs
- ⚡ **Dynamic Configuration** - Configure GUIs through YAML files without restarting
- 🎮 **Multiple GUI Types** - Support for various GUI interfaces including gamemode menus, staff tools, and more
- 🔧 **Easy Management** - Simple commands for managing and opening GUIs
- 🌈 **MiniMessage Support** - Rich text formatting with Adventure API
- 🔄 **Live Reload** - Reload configurations without server restart
- 🎯 **Permission System** - Granular permission control for each GUI

## Installation

1. Download the latest `SkyeGUI-1.0.0.jar` from the releases
2. Place the JAR file in your server's `plugins` folder
3. Restart your server or use a plugin manager to load it
4. Configure your GUIs in the generated `config.yml` and `guis.yml` files

## Commands

| Command | Description | Permission | Usage |
|---------|-------------|------------|-------|
| `/skyegui` | Main plugin management command | `skyegui.admin` | `/skyegui [reload\|version\|list\|open <gui>]` |
| `/creative` | Opens the gamemode menu | `skyegui.creative` | `/creative` |
| `/examplegui` | Opens the example GUI | `skyegui.gui.example` | `/examplegui` |
| `/stafftools` | Opens the staff tools GUI | `skyegui.gui.staff` | `/stafftools` |
| `/gmmenu` | Opens the gamemode menu GUI | `skyegui.gui.gamemode` | `/gmmenu` |

### Command Examples

```bash
# Reload the plugin configuration
/skyegui reload

# List all available GUIs
/skyegui list

# Open a specific GUI
/skyegui open example

# Check plugin version
/skyegui version
```

## Permissions

| Permission | Description | Default |
|------------|-------------|---------|
| `skyegui.admin` | Access to GUI administration commands | `op` |
| `skyegui.gui.example` | Access to example GUI | `true` |
| `skyegui.gui.staff` | Access to staff tools GUI | `op` |
| `skyegui.gui.gamemode` | Access to gamemode menu GUI | `op` |
| `skyegui.creative` | Access to creative menu command | `op` |

## Configuration

### Main Configuration (`config.yml`)
```yaml
# Enable/disable the plugin
enabled: true

# Plugin message prefix
prefix: "<gold>[<aqua>SkyeGUI<gold>] "

# Debug mode
debug: false
```

### GUI Configuration (`guis.yml`)
The plugin supports flexible GUI configuration through YAML. Each GUI can be customized with:

- **Title** - Custom inventory title with MiniMessage formatting
- **Size** - Inventory size (9, 18, 27, 36, 45, 54)
- **Items** - Custom items with materials, names, lore, and enchantments
- **Commands** - Custom command binding

Example GUI configuration:
```yaml
example:
  title: "<gold>Example GUI"
  size: 27
  command: "examplegui"
  items:
    13:
      material: "DIAMOND"
      name: "<aqua>Click Me!"
      lore:
        - "<gray>This is an example item"
        - "<yellow>Click to close"
```

### Messages Configuration (`messages.yml`)
Customize all plugin messages with MiniMessage formatting support:

```yaml
prefix: "<gold>[<aqua>SkyeGUI<gold>] "
version: "<prefix><green>SkyeGUI v1.0.0 by SkyeNetwork Team"
reload: "<prefix><green>Plugin reloaded successfully!"
gui-not-found: "<prefix><red>GUI not found: <white>{gui}"
no-permission: "<prefix><red>You don't have permission to use this command!"
```

## Development

### Building from Source

**Prerequisites:**
- Java 8 or higher
- Maven 3.6+

**Build Steps:**
```bash
git clone https://github.com/SkyeNetMC/SkyeGUIs.git
cd SkyeGUIs
mvn clean package
```

The compiled JAR will be available in the `target/` directory.

### Project Structure
```
src/
├── main/
│   ├── java/
│   │   └── me/pilkeysek/skyegui/
│   │       ├── SkyeGUIPlugin.java          # Main plugin class
│   │       ├── commands/                    # Command handlers
│   │       ├── menu/                        # GUI menu implementations
│   │       └── modules/                     # Core GUI module
│   └── resources/
│       ├── plugin.yml                       # Plugin metadata
│       ├── config.yml                       # Main configuration
│       ├── guis.yml                         # GUI definitions
│       └── messages.yml                     # Message templates
```

## API Usage

SkyeGUI provides a simple API for other plugins to interact with:

```java
// Get the plugin instance
SkyeGUIPlugin skyeGUI = (SkyeGUIPlugin) Bukkit.getPluginManager().getPlugin("SkyeGUI");

// Open a GUI for a player
skyeGUI.getGUIModule().openGUI(player, "example");

// Check if a GUI exists
boolean exists = skyeGUI.getGUIModule().getGUINames().contains("myGui");
```

## Compatibility

- **Minecraft Version**: 1.21+
- **Server Software**: Paper, Spigot, and compatible forks
- **Java Version**: 8+

## 🌐 Online Editor

We provide a convenient web-based editor for development:
- **Editor URL:** [editor.nobleskye.dev](https://editor.nobleskye.dev)
- Edit and test your configurations online
- Real-time syntax highlighting and validation
- Direct integration with the plugin

## 📋 Distribution Policy

**⚠️ IMPORTANT REDISTRIBUTION NOTICE:**
- **DO NOT** share the plugin files directly with others
- **DO NOT** redistribute modified or unmodified versions
- **ALWAYS** direct users to the original source repository
- Any sharing must be done by **linking to the original source only**

**✅ Allowed:**
- Personal use and modification
- Contributing back to the original project
- Learning from the source code

**❌ Prohibited:**
- Direct file sharing or redistribution
- Commercial redistribution
- Independent distribution of modified versions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Website**: [https://skyenet.co.in](https://store.skyenet.co.in)
- **Issues**: [GitHub Issues](https://github.com/SkyeNetMC/SkyeGUIs/issues)
- **Wiki**: [Plugin Documentation](https://github.com/SkyeNetMC/SkyeGUIs/wiki)

## License

This project is licensed under a Custom License - see the [LICENSE](LICENSE) file for details.

**IMPORTANT:** This software has specific redistribution restrictions. Please read the license carefully before sharing or distributing.

## Credits

Developed by the **SkyeNetwork Team**

---

*For more detailed documentation and examples, visit our [Wiki](https://github.com/SkyeNetMC/SkyeGUIs/wiki).*