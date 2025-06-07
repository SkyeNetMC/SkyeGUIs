package me.pilkeysek.skyegui.modules;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.command.CommandSender;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.YamlConfiguration;
import org.bukkit.entity.HumanEntity;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.inventory.InventoryClickEvent;
import org.bukkit.event.inventory.InventoryCloseEvent;
import org.bukkit.event.inventory.InventoryType;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.java.JavaPlugin;

public class GUIModule
implements Listener {
    private final JavaPlugin plugin;
    private final MiniMessage miniMessage = MiniMessage.miniMessage();
    private final Map<String, ConfigurationSection> loadedGUIs = new HashMap<String, ConfigurationSection>();
    private final Map<Player, String> openGUIs = new HashMap<Player, String>();
    private String guiPrefix = "<gold>[<aqua>SkyeGUI<gold>] ";

    public GUIModule(JavaPlugin plugin) {
        this.plugin = plugin;
        this.loadGUIs();
    }

    public void loadGUIs() {
        this.loadedGUIs.clear();
        File guisFile = new File(this.plugin.getDataFolder(), "guis.yml");
        if (!guisFile.exists()) {
            this.plugin.saveResource("guis.yml", false);
            this.plugin.getLogger().info("Created default GUIs configuration file: guis.yml");
        }
        YamlConfiguration guisConfig = YamlConfiguration.loadConfiguration((File)guisFile);
        for (String key : guisConfig.getKeys(false)) {
            ConfigurationSection section = guisConfig.getConfigurationSection(key);
            if (section == null) continue;
            this.loadedGUIs.put(key, section);
            this.plugin.getLogger().info("Loaded GUI: " + key);
        }
        this.guiPrefix = this.plugin.getConfig().getString("prefix", this.guiPrefix);
        this.plugin.getLogger().info("GUIModule loaded with " + this.loadedGUIs.size() + " GUIs");
        if (!this.loadedGUIs.isEmpty()) {
            this.plugin.getLogger().info("Available GUIs:");
            for (String guiName : this.loadedGUIs.keySet()) {
                ConfigurationSection gui = this.loadedGUIs.get(guiName);
                String command = gui.getString("command", guiName.toLowerCase());
                this.plugin.getLogger().info("  - " + guiName + " (/" + command + ")");
            }
        }
    }

    public void reloadGUIs() {
        this.loadGUIs();
        this.registerGUICommands();
        this.plugin.getLogger().info("GUIModule reloaded with " + this.loadedGUIs.size() + " GUIs");
    }

    public int getGUICount() {
        return this.loadedGUIs.size();
    }

    public List<String> getGUINames() {
        return new ArrayList<String>(this.loadedGUIs.keySet());
    }

    public void registerManagementCommand() {
        this.plugin.getLogger().info("GUI management commands registered through main plugin");
    }

    public void registerGUICommands() {
        this.plugin.getLogger().info("GUI commands registered through plugin.yml");
    }

    public void openGUI(Player player, String guiName) {
        if (!this.loadedGUIs.containsKey(guiName)) {
            player.sendMessage(this.miniMessage.deserialize(this.guiPrefix + "<red>GUI not found: " + guiName));
            this.plugin.getLogger().warning("Attempted to open non-existent GUI: " + guiName);
            return;
        }
        ConfigurationSection gui = this.loadedGUIs.get(guiName);
        String title = gui.getString("title", "GUI");
        int size = gui.getInt("size", 27);
        this.plugin.getLogger().info("Opening GUI '" + guiName + "' for player " + player.getName());
        try {
            Inventory inv = Bukkit.createInventory(null, size, this.miniMessage.deserialize(title));
            ConfigurationSection items = gui.getConfigurationSection("items");
            if (items != null) {
                for (String slotStr : items.getKeys(false)) {
                    try {
                        ConfigurationSection enchants;
                        int slot = Integer.parseInt(slotStr);
                        if (slot >= size) {
                            this.plugin.getLogger().warning("Invalid slot " + slot + " in GUI " + guiName + " (size: " + size + ")");
                            continue;
                        }
                        ConfigurationSection itemSec = items.getConfigurationSection(slotStr);
                        if (itemSec == null) continue;
                        Material mat = Material.matchMaterial((String)itemSec.getString("material", "STONE"));
                        if (mat == null) {
                            this.plugin.getLogger().warning("Invalid material in GUI " + guiName + " slot " + slot);
                            mat = Material.STONE;
                        }
                        ItemStack item = new ItemStack(mat);
                        ItemMeta meta = item.getItemMeta();
                        if (itemSec.contains("name")) {
                            meta.displayName(this.miniMessage.deserialize(itemSec.getString("name")));
                        }
                        if (itemSec.contains("lore")) {
                            List<String> lore = itemSec.getStringList("lore");
                            ArrayList<Component> loreComp = new ArrayList<Component>();
                            for (String l : lore) {
                                loreComp.add(this.miniMessage.deserialize(l));
                            }
                            meta.lore(loreComp);
                        }
                        if (itemSec.contains("enchantments") && (enchants = itemSec.getConfigurationSection("enchantments")) != null) {
                            for (String enchantName : enchants.getKeys(false)) {
                                try {
                                    this.plugin.getLogger().info("Enchantment " + enchantName + " configured but skipped due to API changes");
                                }
                                catch (Exception e) {
                                    this.plugin.getLogger().warning("Error with enchantment " + enchantName + " in GUI " + guiName + ": " + e.getMessage());
                                }
                            }
                        }
                        item.setItemMeta(meta);
                        inv.setItem(slot, item);
                    }
                    catch (NumberFormatException e) {
                        this.plugin.getLogger().warning("Invalid slot number in GUI " + guiName + ": " + slotStr);
                    }
                }
            }
            player.openInventory(inv);
            this.openGUIs.put(player, guiName);
        }
        catch (Exception e) {
            this.plugin.getLogger().severe("Error creating GUI " + guiName + ": " + e.getMessage());
            player.sendMessage(this.miniMessage.deserialize(this.guiPrefix + "<red>Error creating GUI!"));
        }
    }

    @EventHandler
    public void onInventoryClick(InventoryClickEvent event) {
        HumanEntity humanEntity = event.getWhoClicked();
        if (!(humanEntity instanceof Player)) {
            return;
        }
        Player player = (Player)humanEntity;
        if (!this.openGUIs.containsKey(player)) {
            return;
        }
        String guiName = this.openGUIs.get(player);
        ConfigurationSection gui = this.loadedGUIs.get(guiName);
        if (gui == null) {
            return;
        }
        event.setCancelled(true);
        if (event.getClickedInventory() == null || event.getClickedInventory().getType() == InventoryType.PLAYER) {
            return;
        }
        ConfigurationSection items = gui.getConfigurationSection("items");
        if (items == null) {
            return;
        }
        String slotStr = String.valueOf(event.getSlot());
        ConfigurationSection itemSec = items.getConfigurationSection(slotStr);
        if (itemSec == null) {
            return;
        }
        if (itemSec.contains("commands")) {
            for (String cmd : itemSec.getStringList("commands")) {
                String finalCmd = cmd.replace("%player%", player.getName());
                Bukkit.getScheduler().runTask((Plugin)this.plugin, () -> Bukkit.dispatchCommand((CommandSender)(itemSec.getBoolean("console", false) ? Bukkit.getConsoleSender() : player), (String)finalCmd));
            }
        }
        if (itemSec.getBoolean("close", false)) {
            player.closeInventory();
        }
    }

    @EventHandler
    public void onInventoryClose(InventoryCloseEvent event) {
        HumanEntity humanEntity = event.getPlayer();
        if (humanEntity instanceof Player) {
            Player player = (Player)humanEntity;
            this.openGUIs.remove(player);
        }
    }

    public void listGUIs(CommandSender sender) {
        sender.sendMessage(this.miniMessage.deserialize(this.guiPrefix + "<yellow>Available GUIs:"));
        for (String guiName : this.loadedGUIs.keySet()) {
            ConfigurationSection gui = this.loadedGUIs.get(guiName);
            String command = gui.getString("command", guiName.toLowerCase());
            sender.sendMessage(this.miniMessage.deserialize("<gray>- <aqua>" + guiName + "</aqua> (Command: <white>/" + command + "</white>)"));
        }
    }

    public void handleGUICommand(CommandSender sender, String guiName) {
        if (sender instanceof Player) {
            Player player = (Player)sender;
            this.openGUI(player, guiName);
        } else {
            sender.sendMessage(this.miniMessage.deserialize(this.guiPrefix + "<red>This command can only be used by players!"));
        }
    }
}

