"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MinecraftIcon } from "@/components/ui/minecraft-icon"
import { Download, Upload, Github, Settings, Plus, Trash2, Grid3X3 } from "lucide-react"

interface GuiItem {
  id: string
  slot: number
  material: string
  name: string
  lore: string[]
  commands: string[]
  amount?: number
  customModelData?: number
}

interface GuiPanel {
  title: string
  rows: number
  permission: string
  fillItem: string
  openCommands: string[]
  closeCommands: string[]
  items: GuiItem[]
}

// Common Minecraft materials for the dropdown
const COMMON_MATERIALS = [
  // Basic blocks
  'stone', 'cobblestone', 'dirt', 'grass_block', 'sand', 'gravel', 'bedrock',
  'oak_wood', 'oak_planks', 'glass', 'obsidian', 'netherrack', 'end_stone',
  
  // Ores and minerals
  'coal_ore', 'iron_ore', 'gold_ore', 'diamond_ore', 'emerald_ore', 'redstone_ore',
  'coal', 'iron_ingot', 'gold_ingot', 'diamond', 'emerald', 'redstone',
  
  // Tools and weapons
  'wooden_sword', 'stone_sword', 'iron_sword', 'diamond_sword', 'netherite_sword',
  'wooden_pickaxe', 'stone_pickaxe', 'iron_pickaxe', 'diamond_pickaxe', 'netherite_pickaxe',
  'wooden_axe', 'stone_axe', 'iron_axe', 'diamond_axe', 'netherite_axe',
  'wooden_shovel', 'stone_shovel', 'iron_shovel', 'diamond_shovel', 'netherite_shovel',
  'bow', 'crossbow', 'shield', 'trident',
  
  // Armor
  'leather_helmet', 'iron_helmet', 'diamond_helmet', 'netherite_helmet',
  'leather_chestplate', 'iron_chestplate', 'diamond_chestplate', 'netherite_chestplate',
  'leather_leggings', 'iron_leggings', 'diamond_leggings', 'netherite_leggings',
  'leather_boots', 'iron_boots', 'diamond_boots', 'netherite_boots',
  
  // Food
  'apple', 'bread', 'cooked_beef', 'cooked_porkchop', 'cooked_chicken', 'golden_apple',
  'cake', 'cookie', 'melon_slice', 'sweet_berries', 'carrot', 'potato',
  
  // Redstone and mechanics
  'redstone', 'redstone_torch', 'lever', 'button', 'pressure_plate', 'tripwire_hook',
  'piston', 'dispenser', 'dropper', 'hopper', 'comparator', 'repeater',
  
  // Decorative
  'torch', 'lantern', 'painting', 'item_frame', 'flower_pot', 'banner',
  'chest', 'barrel', 'bookshelf', 'enchanting_table', 'anvil', 'beacon',
  
  // Special items
  'ender_pearl', 'blaze_rod', 'nether_star', 'elytra', 'totem_of_undying',
  'compass', 'clock', 'map', 'name_tag', 'saddle', 'lead'
]

export default function SkyeGuiEditor() {
  const [panel, setPanel] = useState<GuiPanel>({
    title: "&8New Panel",
    rows: 6,
    permission: "admin",
    fillItem: "AIR",
    openCommands: [],
    closeCommands: [],
    items: [],
  })

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<GuiItem | null>(null)

  const totalSlots = panel.rows * 9

  const handleSlotClick = (slotIndex: number) => {
    setSelectedSlot(slotIndex)
    const item = panel.items.find((item) => item.slot === slotIndex)
    setSelectedItem(item || null)
  }

  const updatePanel = (updates: Partial<GuiPanel>) => {
    setPanel((prev) => ({ ...prev, ...updates }))
  }

  const updateSelectedItem = (updates: Partial<GuiItem>) => {
    if (!selectedItem || selectedSlot === null) return

    const updatedItem = { ...selectedItem, ...updates }

    setPanel((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.slot === selectedSlot ? updatedItem : item)),
    }))

    setSelectedItem(updatedItem)
  }

  // Color code conversion function
  const convertColorCodes = () => {
    if (!selectedItem) return

    const colorCodeMap: { [key: string]: string } = {
      '&0': '<black>',
      '&1': '<dark_blue>',
      '&2': '<dark_green>',
      '&3': '<dark_aqua>',
      '&4': '<dark_red>',
      '&5': '<dark_purple>',
      '&6': '<gold>',
      '&7': '<gray>',
      '&8': '<dark_gray>',
      '&9': '<blue>',
      '&a': '<green>',
      '&b': '<aqua>',
      '&c': '<red>',
      '&d': '<light_purple>',
      '&e': '<yellow>',
      '&f': '<white>',
      '&k': '<obfuscated>',
      '&l': '<bold>',
      '&m': '<strikethrough>',
      '&n': '<underlined>',
      '&o': '<italic>',
      '&r': '<reset>'
    }

    let convertedName = selectedItem.name
    let convertedLore = [...selectedItem.lore]

    // Convert name
    Object.entries(colorCodeMap).forEach(([oldCode, newCode]) => {
      convertedName = convertedName.replace(new RegExp(oldCode, 'g'), newCode)
    })

    // Convert lore
    convertedLore = convertedLore.map(line => {
      let convertedLine = line
      Object.entries(colorCodeMap).forEach(([oldCode, newCode]) => {
        convertedLine = convertedLine.replace(new RegExp(oldCode, 'g'), newCode)
      })
      return convertedLine
    })

    updateSelectedItem({ 
      name: convertedName, 
      lore: convertedLore 
    })
  }

  const addItemToSlot = () => {
    if (selectedSlot === null) return

    const newItem: GuiItem = {
      id: `item_${Date.now()}`,
      slot: selectedSlot,
      material: "STONE",
      name: "&7New Item",
      lore: [],
      commands: [],
    }

    setPanel((prev) => ({
      ...prev,
      items: [...prev.items.filter((item) => item.slot !== selectedSlot), newItem],
    }))

    setSelectedItem(newItem)
  }

  const removeItemFromSlot = () => {
    if (selectedSlot === null) return

    setPanel((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.slot !== selectedSlot),
    }))

    setSelectedItem(null)
  }

  const exportToYaml = () => {
    const yamlContent = `# Skye GUIs Configuration
title: "${panel.title}"
rows: ${panel.rows}
permission: "${panel.permission}"
fill-item: "${panel.fillItem}"

open-commands:
${panel.openCommands.map((cmd) => `  - "${cmd}"`).join("\n")}

close-commands:
${panel.closeCommands.map((cmd) => `  - "${cmd}"`).join("\n")}

items:
${panel.items
  .map(
    (item) => `
  ${item.slot}:
    material: ${item.material}
    name: "${item.name}"
    lore:
${item.lore.map((line) => `      - "${line}"`).join("\n")}
    commands:
${item.commands.map((cmd) => `      - "${cmd}"`).join("\n")}
${item.amount ? `    amount: ${item.amount}` : ""}
${item.customModelData ? `    custom-model-data: ${item.customModelData}` : ""}
`,
  )
  .join("")}
`

    const blob = new Blob([yamlContent], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${panel.title.replace(/[^a-zA-Z0-9]/g, "_")}.yml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importFromYaml = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      // Basic YAML parsing - in a real app, you'd use a proper YAML parser
      console.log("Imported YAML:", content)
      // TODO: Implement proper YAML parsing
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-8 h-8 text-yellow-400" />
              <h1 className="text-2xl font-bold text-yellow-400">SKYE GUIS</h1>
            </div>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              Editor v1.0
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={exportToYaml}
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Export YAML
            </Button>
            <Button
              variant="default"
              size="sm"
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            >
              <label>
                <Upload className="w-4 h-4 mr-2" />
                Import YAML
                <input type="file" accept=".yml,.yaml" className="hidden" onChange={importFromYaml} />
              </label>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            >
              <a href="https://github.com/skyenetmc/skyeguis" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Panel Settings */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Panel Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-600">
                  <TabsTrigger value="basic" className="text-white data-[state=active]:bg-blue-600">
                    Basic
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="text-white data-[state=active]:bg-blue-600">
                    Advanced
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label htmlFor="permission" className="text-white">
                      Permission:
                    </Label>
                    <Input
                      id="permission"
                      value={panel.permission}
                      onChange={(e) => updatePanel({ permission: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rows" className="text-white">
                      Rows:
                    </Label>
                    <Select
                      value={panel.rows.toString()}
                      onValueChange={(value) => updatePanel({ rows: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-600 border-slate-500">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title" className="text-white">
                      Title:
                    </Label>
                    <Input
                      id="title"
                      value={panel.title}
                      onChange={(e) => updatePanel({ title: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fillItem" className="text-white">
                      Fill Item:
                    </Label>
                    <Input
                      id="fillItem"
                      value={panel.fillItem}
                      onChange={(e) => updatePanel({ fillItem: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div>
                    <Label className="text-white">Commands To Open:</Label>
                    <Textarea
                      value={panel.openCommands.join("\n")}
                      onChange={(e) => updatePanel({ openCommands: e.target.value.split("\n").filter(Boolean) })}
                      className="bg-slate-600 border-slate-500 text-white h-20"
                      placeholder="Enter commands (one per line)"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Commands On Close:</Label>
                    <Textarea
                      value={panel.closeCommands.join("\n")}
                      onChange={(e) => updatePanel({ closeCommands: e.target.value.split("\n").filter(Boolean) })}
                      className="bg-slate-600 border-slate-500 text-white h-20"
                      placeholder="Enter commands (one per line)"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Center - Panel Slots Grid */}
        <div className="flex-1 p-6 bg-slate-900">
          <Card className="bg-slate-800 border-slate-700 h-full">
            <CardHeader>
              <CardTitle className="text-white text-center">Panel Slots</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="grid gap-1 p-4 bg-slate-700 rounded-lg" style={{ gridTemplateColumns: "repeat(9, 1fr)" }}>
                {Array.from({ length: totalSlots }, (_, index) => {
                  const item = panel.items.find((item) => item.slot === index)
                  const isSelected = selectedSlot === index

                  return (
                    <div
                      key={index}
                      className={`
                        w-12 h-12 border-2 rounded cursor-pointer flex items-center justify-center text-xs
                        ${isSelected ? "border-blue-400 bg-blue-600/20" : "border-slate-500 bg-slate-600"}
                        ${item ? "bg-yellow-600/20 border-yellow-400" : ""}
                        hover:border-blue-300 transition-colors
                      `}
                      onClick={() => handleSlotClick(index)}
                      title={`Slot ${index}${item ? ` - ${item.name}` : ""}`}
                    >
                      {item ? (
                        <MinecraftIcon 
                          itemId={item.material} 
                          size={32}
                          fallback={<div className="text-yellow-400 font-bold">{item.material.charAt(0)}</div>}
                        />
                      ) : (
                        <span className="text-slate-400">{index}</span>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex gap-2">
                <Button onClick={addItemToSlot} disabled={selectedSlot === null}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                <Button variant="destructive" onClick={removeItemFromSlot} disabled={!selectedItem}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Item Settings */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">
                {selectedSlot !== null ? `Slot ${selectedSlot}` : "Item Settings"}
              </CardTitle>
              {selectedSlot !== null && !selectedItem && <p className="text-slate-400 text-sm">No item in this slot</p>}
            </CardHeader>

            {selectedItem && (
              <CardContent className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-600">
                    <TabsTrigger value="basic" className="text-white data-[state=active]:bg-blue-600">
                      Basic
                    </TabsTrigger>
                    <TabsTrigger value="actions" className="text-white data-[state=active]:bg-blue-600">
                      Actions
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <Label className="text-white">Material:</Label>
                      <div className="flex gap-2 items-start">
                        <div className="flex-shrink-0">
                          <MinecraftIcon 
                            itemId={selectedItem.material} 
                            size={40}
                            className="border border-slate-500 rounded bg-slate-700 p-1"
                            fallback={<div className="text-slate-400 font-bold text-lg">{selectedItem.material.charAt(0)}</div>}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Select 
                            value={selectedItem.material} 
                            onValueChange={(value) => updateSelectedItem({ material: value })}
                          >
                            <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                              <SelectValue placeholder="Select material..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600 max-h-60">
                              {COMMON_MATERIALS.map((material) => (
                                <SelectItem 
                                  key={material} 
                                  value={material.toUpperCase()}
                                  className="text-white hover:bg-slate-600 focus:bg-slate-600"
                                >
                                  <div className="flex items-center gap-2">
                                    <MinecraftIcon itemId={material} size={16} />
                                    <span className="capitalize">{material.replace(/_/g, ' ')}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            value={selectedItem.material}
                            onChange={(e) => updateSelectedItem({ material: e.target.value })}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Or type custom material (e.g., STONE)"
                          />
                          <p className="text-xs text-slate-400">
                            Icons provided by{" "}
                            <a 
                              href="https://github.com/jacobsjo/mcicons" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline"
                            >
                              jacobsjo/mcicons
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Name:</Label>
                      <Input
                        value={selectedItem.name}
                        onChange={(e) => updateSelectedItem({ name: e.target.value })}
                        className="bg-slate-600 border-slate-500 text-white"
                        placeholder="&7Item Name"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Lore:</Label>
                      <Textarea
                        value={selectedItem.lore.join("\n")}
                        onChange={(e) => updateSelectedItem({ lore: e.target.value.split("\n").filter(Boolean) })}
                        className="bg-slate-600 border-slate-500 text-white h-20"
                        placeholder="Enter lore lines (one per line)"
                      />
                      <Button 
                        onClick={convertColorCodes}
                        variant="secondary" 
                        size="sm"
                        className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white border-purple-500"
                      >
                        Convert Color Codes (&a → &lt;green&gt;)
                      </Button>
                    </div>

                    <div>
                      <Label className="text-white">Amount:</Label>
                      <Input
                        type="number"
                        value={selectedItem.amount || 1}
                        onChange={(e) => updateSelectedItem({ amount: Number.parseInt(e.target.value) || 1 })}
                        className="bg-slate-600 border-slate-500 text-white"
                        min="1"
                        max="64"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-4">
                    <div>
                      <Label className="text-white">Commands:</Label>
                      <Textarea
                        value={selectedItem.commands.join("\n")}
                        onChange={(e) => updateSelectedItem({ commands: e.target.value.split("\n").filter(Boolean) })}
                        className="bg-slate-600 border-slate-500 text-white h-32"
                        placeholder="Enter commands (one per line)"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Custom Model Data:</Label>
                      <Input
                        type="number"
                        value={selectedItem.customModelData || ""}
                        onChange={(e) =>
                          updateSelectedItem({ customModelData: Number.parseInt(e.target.value) || undefined })
                        }
                        className="bg-slate-600 border-slate-500 text-white"
                        placeholder="Optional"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            Made by{" "}
            <span className="text-blue-400 font-semibold">NobleSkye</span>
            {" "}for{" "}
            <span className="text-purple-400 font-semibold">Skye Network</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
