import * as gui from '@cristalix/client-api';
import * as easing from '@cristalix/client-api/lib/easing';

(function (plugin: any) {
    PluginMessages.on(plugin, 'opencase', (bb: ByteBuf) => {
        chest.item = bb.readItemStack();
        form.enabled = true;
        form.children.forEach(element => element.enabled = true);
    });

    Events.on(plugin, 'key_press', (e: KeyPressEvent) => {
        if (e.key === Keyboard.KEY_TAB) {
            form.enabled = false;
            form.children.forEach(element => element.enabled = false);
            chest.scale.transit(2, 200, easing.none)
        }
    });

    const chest = new gui.Item({
        item: null,
        scale: 6,
        origin: {x: 0.5, y: 1},
        color: {a: 1, r: 0, g: 0, b: 0},
        align: {x: 0.5, y: 0.5},
    });

    const form = gui.rect({
        origin: {x: 0.5, y: 0.5},
        color: {a: 1, r: 0, g: 0, b: 0},
        align: {x: 0.5, y: 0.5},
        scale: 1,
        children: [
            gui.text({
                scale: 2,
                text: "§6§lНАГРАДА",
                origin: {x: 0.5, y: 6.2},
                align: {x: 0.5, y: 0.5},
                shadow: true
            }), gui.text({
                scale: 2,
                text: "§a§l100`000$",
                origin: {x: 0.5, y: -0.1},
                align: {x: 0.5, y: 0.5},
                shadow: true
            }), gui.text({
                scale: 1.2,
                text: "Нажмите §lTAB §fчтобы получить!",
                origin: {x: 0.5, y: -1.86},
                align: {x: 0.5, y: 0.5},
                shadow: true
            }), chest]
    })

    form.enabled = false;
    form.children.forEach(element => element.enabled = false);

    gui.overlay.push(form);
})(plugin);