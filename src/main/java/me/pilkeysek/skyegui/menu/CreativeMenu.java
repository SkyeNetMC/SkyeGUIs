package me.pilkeysek.skyegui.menu;

import org.bukkit.Bukkit;
import org.bukkit.GameMode;
import org.bukkit.Material;
import org.bukkit.entity.HumanEntity;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.inventory.InventoryClickEvent;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;

public class CreativeMenu
implements Listener {
    private static final String MENU_TITLE = "Gamemode Menu";
    private static final int WOOL_SLOT = 4;

    public static void openMenu(Player player) {
        Inventory inventory = Bukkit.createInventory(null, 9, MENU_TITLE);
        CreativeMenu.updateWoolState(inventory, player);
        player.openInventory(inventory);
    }

    private static void updateWoolState(Inventory inventory, Player player) {
        ItemStack wool = new ItemStack(player.getGameMode() == GameMode.CREATIVE ? Material.RED_WOOL : Material.LIME_WOOL);
        ItemMeta meta = wool.getItemMeta();
        meta.setDisplayName(player.getGameMode() == GameMode.CREATIVE ? "\u00a7cClick to set Adventure Mode" : "\u00a7aClick to set Creative Mode");
        wool.setItemMeta(meta);
        inventory.setItem(4, wool);
    }

    @EventHandler
    public void onInventoryClick(InventoryClickEvent event) {
        if (!event.getView().getTitle().equals(MENU_TITLE)) {
            return;
        }
        event.setCancelled(true);
        HumanEntity humanEntity = event.getWhoClicked();
        if (!(humanEntity instanceof Player)) {
            return;
        }
        Player player = (Player)humanEntity;
        if (event.getSlot() != 4) {
            return;
        }
        if (player.getGameMode() == GameMode.CREATIVE) {
            player.setGameMode(GameMode.ADVENTURE);
        } else {
            player.setGameMode(GameMode.CREATIVE);
        }
        CreativeMenu.updateWoolState(event.getInventory(), player);
    }
}

