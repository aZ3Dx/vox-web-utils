"use client";

import { Menu, Button, useMantineColorScheme } from "@mantine/core";
import { Moon, Sun, SunMoon } from "lucide-react";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Menu radius="md">
      <Menu.Target>
        <Button>Toggle theme</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Toggle color scheme</Menu.Label>
        <Menu.Item
          leftSection={<Sun size={14} />}
          onClick={() => setColorScheme("light")}
        >
          Light
        </Menu.Item>
        <Menu.Item
          leftSection={<Moon size={14} />}
          onClick={() => setColorScheme("dark")}
        >
          Dark
        </Menu.Item>
        <Menu.Item
          leftSection={<SunMoon size={14} />}
          onClick={() => setColorScheme("auto")}
        >
          Auto
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
