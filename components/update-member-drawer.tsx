import { Button } from "./ui/button";
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle, DrawerTrigger } from "./ui/drawer";

export function UpdateMemberDrawer() {
    return (
        <Drawer position="right">
            <DrawerTrigger render={<Button variant="outline" />}>
                Update Member
            </DrawerTrigger>
            <DrawerPopup variant="inset">
                <DrawerHeader>
                    <DrawerTitle>Right</DrawerTitle>
                </DrawerHeader>
                <DrawerPanel>
                    <p className="text-muted-foreground text-sm">
                        Content from the right.
                    </p>
                </DrawerPanel>
            </DrawerPopup>
        </Drawer>
    )
}