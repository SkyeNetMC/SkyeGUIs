package me.pilkeysek.skyegui.commands;

import me.pilkeysek.skyegui.menu.CreativeMenu;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class GamemodeMenuCommand
implements CommandExecutor {
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            sender.sendMessage("\u00a7cThis command can only be used by players!");
            return true;
        }
        Player player = (Player)sender;
        if (!player.hasPermission("skyegui.creative")) {
            player.sendMessage("\u00a7cYou don't have permission to use this command!");
            return true;
        }
        CreativeMenu.openMenu(player);
        return true;
    }
}

