"use client";

import { AppShell, Burger, Group, Image, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ColorSchemeToggle } from "../ColorSchemeToggle";
import { Calculator } from "lucide-react";
import "./styles.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AppContainer({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  // Get current path to highlight the active link
  const pathName = usePathname();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link href="/">
            <Image
              src="/mantine.png"
              alt="Mantine"
              h={30}
              w="auto"
              radius="md"
            />
          </Link>
          <ColorSchemeToggle />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavLink
          label="Calculators"
          fz="sm"
          leftSection={<Calculator size={18} />}
        >
          <NavLink
            active={pathName === "/calculadora/generadores"}
            component={Link}
            href="/calculadora/generadores"
            label="Gens"
          />
          <NavLink
            active={pathName === "/calculadora/compactos"}
            component={Link}
            href="/calculadora/compactos"
            label="Compactos"
          />
        </NavLink>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default AppContainer;
