package me.pilkeysek.skyegui;

import java.io.File;
import me.pilkeysek.skyegui.commands.SkyeGUITabCompleter;
import me.pilkeysek.skyegui.menu.CreativeMenu;
import me.pilkeysek.skyegui.modules.GUIModule;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.configuration.file.YamlConfiguration;
import org.bukkit.entity.Player;
import org.bukkit.event.Listener;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.java.JavaPlugin;

public final class SkyeGUIPlugin
extends JavaPlugin {
    public static FileConfiguration config;
    private YamlConfiguration messagesConfig;
    private MiniMessage miniMessage = MiniMessage.miniMessage();
    private GUIModule guiModule;

    private void loadMessages() {
        File messagesFile = new File(this.getDataFolder(), "messages.yml");
        if (!messagesFile.exists()) {
            this.saveResource("messages.yml", false);
        }
        this.messagesConfig = YamlConfiguration.loadConfiguration(messagesFile);
    }

    public String getRawMessage(String key) {
        return this.messagesConfig.getString(key, "");
    }

    public Component getMessage(String key) {
        String msg = this.getRawMessage(key);
        String prefix = this.messagesConfig.getString("prefix", "");
        msg = msg.replace("<prefix>", prefix);
        msg = msg.replace("<version>", this.getName());
        return this.miniMessage.deserialize(msg);
    }

    public GUIModule getGUIModule() {
        return this.guiModule;
    }

    public void onLoad() {
    }

    public void onEnable() {
        File configFile;
        if (!this.getDataFolder().exists()) {
            this.getDataFolder().mkdirs();
        }
        if (!(configFile = new File(this.getDataFolder(), "config.yml")).exists()) {
            this.saveDefaultConfig();
        }
        config = this.getConfig();
        this.loadMessages();
        this.guiModule = new GUIModule(this);
        this.getCommand("skyegui").setTabCompleter(new SkyeGUITabCompleter(this));
        this.getServer().getPluginManager().registerEvents(new CreativeMenu(), this);
        if (config.getBoolean("enabled", true)) {
            this.getServer().getPluginManager().registerEvents(this.guiModule, this);
            this.guiModule.registerGUICommands();
            this.guiModule.registerManagementCommand();
            this.getLogger().info("SkyeGUI Plugin enabled with " + this.guiModule.getGUICount() + " GUIs");
        } else {
            this.getLogger().info("SkyeGUI Plugin is disabled in config");
        }
    }

    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        String commandName = command.getName().toLowerCase();
        if (commandName.equals("skyegui")) {
            if (args.length > 0) {
                if (args[0].equalsIgnoreCase("reload")) {
                    this.reloadConfig();
                    config = this.getConfig();
                    this.loadMessages();
                    if (this.guiModule != null) {
                        this.guiModule.reloadGUIs();
                    }
                    sender.sendMessage(this.miniMessage.deserialize((config.getString("prefix", "<gold>[<aqua>SkyeGUI<gold>] ") + "<green>Plugin reloaded! (" + this.guiModule.getGUICount() + " GUIs loaded)")));
                    return true;
                }
                if (args[0].equalsIgnoreCase("version")) {
                    sender.sendMessage(this.getMessage("version"));
                    return true;
                }
                if (args[0].equalsIgnoreCase("list")) {
                    if (this.guiModule != null) {
                        sender.sendMessage(this.miniMessage.deserialize((config.getString("prefix", "<gold>[<aqua>SkyeGUI<gold>] ") + "<green>Available GUIs: <white>" + String.join((CharSequence)", ", this.guiModule.getGUINames()))));
                    } else {
                        sender.sendMessage(this.miniMessage.deserialize((config.getString("prefix", "<gold>[<aqua>SkyeGUI<gold>] ") + "<red>GUI module not loaded!")));
                    }
                    return true;
                }
                if (args[0].equalsIgnoreCase("open") && args.length > 1) {
                    if (!(sender instanceof Player)) {
                        sender.sendMessage(this.miniMessage.deserialize("<red>This command can only be used by players!"));
                        return true;
                    }
                    if (this.guiModule != null) {
                        String guiName = args[1];
                        if (this.guiModule.getGUINames().contains(guiName)) {
                            this.guiModule.openGUI((Player)sender, guiName);
                            sender.sendMessage(this.miniMessage.deserialize((config.getString("prefix", "<gold>[<aqua>SkyeGUI<gold>] ") + "<green>Opened GUI: <white>" + guiName)));
                        } else {
                            sender.sendMessage(this.miniMessage.deserialize((config.getString("prefix", "<gold>[<aqua>SkyeGUI<gold>] ") + "<red>GUI not found: <white>" + guiName)));
                        }
                    } else {
                        sender.sendMessage(this.miniMessage.deserialize((config.getString("prefix", "<gold>[<aqua>SkyeGUI<gold>] ") + "<red>GUI module not loaded!")));
                    }
                    return true;
                }
            }
            sender.sendMessage(this.miniMessage.deserialize((config.getString("prefix", "<gold>[<aqua>SkyeGUI<gold>] ") + "<yellow>Usage: /skyegui <list|reload|version|open <gui_name>>")));
            return true;
        }
        if (commandName.equals("examplegui")) {
            if (sender instanceof Player) {
                this.guiModule.openGUI((Player)sender, "example");
            } else {
                sender.sendMessage(this.miniMessage.deserialize("<red>This command can only be used by players!"));
            }
            return true;
        }
        if (commandName.equals("stafftools")) {
            if (sender instanceof Player) {
                this.guiModule.openGUI((Player)sender, "staff_tools");
            } else {
                sender.sendMessage(this.miniMessage.deserialize("<red>This command can only be used by players!"));
            }
            return true;
        }
        if (commandName.equals("gmmenu")) {
            if (sender instanceof Player) {
                this.guiModule.openGUI((Player)sender, "gamemode_menu");
            } else {
                sender.sendMessage(this.miniMessage.deserialize("<red>This command can only be used by players!"));
            }
            return true;
        }
        return false;
    }

    public void onDisable() {
        this.getLogger().info("SkyeGUI Plugin disabled");
    }
}

