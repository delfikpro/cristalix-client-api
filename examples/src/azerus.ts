import * as gui from '@cristalix/client-api';
import * as easing from '@cristalix/client-api/lib/easing'

(function (plugin: any) {

    let background = { a: 0.3, r: 0, g: 0, b: 0 };

    class Indicator extends gui.Box {

        public readonly valueBox: gui.Box;
        public readonly titleText: gui.Text;
        public readonly valueText: gui.Text;

        constructor(
            title: string,
            color: gui.Color,
            position: gui.BoxData
        ) {
            super({
                color: background,
                ...position,
                height: 10,
                children: [
                    gui.rect({
                        color: { ...color, a: 0.75 }, // Добавляем цвету прозрачности
                        width: 0,
                        height: 10,
                    }),
                    gui.text({
                        align: gui.LEFT,
                        origin: gui.LEFT,
                        text: title,
                        x: 2,
                        shadow: true,
                    }),
                    gui.text({
                        align: gui.CENTER,
                        origin: gui.CENTER,
                        text: '§7???',
                        shadow: true,
                    })
                ]
            });
            this.valueBox = this.children[0] as gui.Box;
            this.titleText = this.children[1] as gui.Text;
            this.valueText = this.children[2] as gui.Text;
        }

        setPercentage(percentage: number) {
            if (percentage != percentage) percentage = 0; // Проверка на NaN
            this.valueBox.width.transit(this.width.value * percentage, 200, easing.outCubic);
        }

    }

    // Первый аргумент - надпись слева
    // Второй - цвет индикатора
    // Третий - позиция и размер индикатора

    let levelIndicator = new Indicator('§6??? LVL', { r: 0.07, g: 0.86, b: 0.55 }, {
        y: -20,
        align: gui.CENTER,
        origin: gui.CENTER,
        width: 180,
    })

    let healthIndicator = new Indicator('§c❤', { r: 0.9, g: 0.1 }, {
        y: -32,
        x: -1,
        align: gui.CENTER,
        origin: gui.RIGHT,
        width: 89,
    })

    let manaIndicator = new Indicator('§b☬', { g: 0.5, b: 1 }, {
        y: -32,
        x: +1,
        align: gui.CENTER,
        origin: gui.LEFT,
        width: 89,
    })

    let foodIndicator = new Indicator('§6㖑', { r: 0.9, g: 0.5 }, {
        y: -44,
        x: +1,
        align: gui.CENTER,
        origin: gui.LEFT,
        width: 89,
    })

    let indicators = gui.rect({
        origin: gui.BOTTOM,
        align: gui.BOTTOM,

        y: -10,

        children: [
            levelIndicator,
            healthIndicator,
            manaIndicator,
            foodIndicator
        ]
    });

    gui.overlay.push(indicators);

    let callback = (e: CancellableRenderEvent) => e.cancelled = true;

    Events.on(plugin, 'health_render', callback);
    Events.on(plugin, 'exp_render', callback);
    Events.on(plugin, 'hunger_render', callback);
    Events.on(plugin, 'armor_render', callback);

    PluginMessages.on(plugin, 'azerus:bar', buffer => {

        let health = buffer.readInt();
        let maxHealth = buffer.readInt();

        let level = buffer.readInt();
        let xp = buffer.readInt();
        let needXp = buffer.readInt();

        let food = buffer.readInt();

        let mana = 100, maxMana = 200;

        healthIndicator.setPercentage(health / maxHealth);
        healthIndicator.valueText.text = `${health}/${maxHealth}`;

        manaIndicator.setPercentage(mana / maxMana);
        manaIndicator.valueText.text = `${mana}/${maxMana}`;

        foodIndicator.setPercentage(food / 20);
        foodIndicator.valueText.text = `${food}/20`;

        levelIndicator.setPercentage(needXp ? xp / needXp : 1);
        levelIndicator.valueText.text = needXp ? `${xp}/${needXp}` : 'Максимальный уровень';
        levelIndicator.titleText.text = `§6${level} LVL`;
    })

})(plugin);