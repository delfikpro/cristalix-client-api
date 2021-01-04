import * as gui from '../../src/simple-gui';
import * as items from '../../src/simple-item';
// import * as nbt from '@cristalix/client-api/lib/simple-nbt';
import * as easing from '../../src/easing';

let item = items.create('minecraft:chest', 0, 1);

(function (plugin: any) {
    PluginMessages.on(plugin, 'opencase', (bb: ByteBuf) => {
        chest.item = bb.readItemStack();
        form.enabled = true;
        form.children.forEach(element => element.enabled = true);
    });

    Events.on(plugin, 'key_press', (e: KeyPressEvent) => {
        if (e.key === Keyboard.KEY_TAB) {
            // form.enabled = false;
            // form.children.forEach(element => element.enabled = false);
            chest.scale.transit(2, 200, easing.none)
        }
    });

    Events.on(plugin, 'player_list_render', (e: CancellableRenderEvent) => e.cancelled = true);



    

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

    // form.enabled = false;
    // form.children.forEach(element => element.enabled = false);

    gui.overlay.push(form);
})(plugin);

// (function (plugin: any) {
//     PluginMessages.on(plugin, 'opencase', (bb: ByteBuf) => {
//         chest.item = bb.readItemStack();
//     });


//     var chest = new gui.Item({
//         item: item,
//         scale: 6,
//         // origin: {x: 0.5, y: 1},
//         color: {a: 1, r: 1, g: 1, b: 1},
//         align: {x: 0.5, y: 0.5},
//     });


//     gui.overlay.push(gui.rect({children:[chest],width:10,height:10}));
//     gui.overlay.push(gui.text({
//         text:'123',
//         y:50
//     }));

    
//     Events.on(plugin, 'key_press', (e: KeyPressEvent) => {
//         if (e.key === Keyboard.KEY_TAB) {
//             chest.scale.transit(2, 200, easing.none)
//         }
//     });
// })(plugin);
