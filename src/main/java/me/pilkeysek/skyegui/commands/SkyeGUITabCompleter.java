package me.pilkeysek.skyegui.commands;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import me.pilkeysek.skyegui.SkyeGUIPlugin;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;

public class SkyeGUITabCompleter
implements TabCompleter {
    private final SkyeGUIPlugin plugin;

    public SkyeGUITabCompleter(SkyeGUIPlugin plugin) {
        this.plugin = plugin;
    }

    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        ArrayList<String> completions;
        block2: {
            block3: {
                completions = new ArrayList<String>();
                if (!command.getName().equalsIgnoreCase("skyegui")) break block2;
                if (args.length != 1) break block3;
                List<String> subcommands = Arrays.asList("list", "reload", "version", "open");
                String input = args[0].toLowerCase();
                for (String subcommand : subcommands) {
                    if (!subcommand.startsWith(input)) continue;
                    completions.add(subcommand);
                }
                break block2;
            }
            if (args.length != 2 || !args[0].equalsIgnoreCase("open") || this.plugin.getGUIModule() == null) break block2;
            List<String> guiNames = this.plugin.getGUIModule().getGUINames();
            String input = args[1].toLowerCase();
            for (String guiName : guiNames) {
                if (!guiName.toLowerCase().startsWith(input)) continue;
                completions.add(guiName);
            }
        }
        return completions;
    }
}

