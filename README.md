# Публичный API клиента Cristalix

### Установка
Прежде всего вам необходим node.js и npm - скачать их можно [здесь](https://nodejs.org).

Этот репозиторий подразумевает использование языка [TypeScript](https://typescriptlang.org/docs), и, хоть вы и можете писать и на чистом JS, опираясь на референсы, 
клиент Cristalix поддерживает далеко не весь функционал стандарта ES6 (нет стрелочных функций, классов, наследования) - настоятельно рекомендуем вам использовать
наш упаковщик.

Для установки последней версии референсов:
```
npm install @cristalix/client-api
```

Для установки упаковщика TypeScript в поддерживаемую на Cristalix версию JS:
```
npm install -g @cristalix/bundler
```

Также рекомендуем использовать [VSCode](https://code.visualstudio.com/download) с его замечательной поддержкой TypeScript.

### Использование

В качестве примера приведён скрипт для простеньких Keystrokes

![Keystrokes](https://i.imgur.com/Ot2GiMf.png)

Файл `keystrokes.ts`:

```ts
/// <reference types="@cristalix/client-api" />

function drawKey(title: string, key: number, x: number, y: number) {

    Draw.drawRect(x, y, x + 10, y + 10, Keyboard.isKeyDown(key) ? 0xAAFFFFFF : 0x80000000);
    Draw.drawStringWithShadow(title, x + 3, y, -1);

}

Events.on(plugin, 'gui_overlay_render', () => {
    drawKey('W', Keyboard.KEY_W, 15, 30);
    drawKey('A', Keyboard.KEY_A, 2, 43);
    drawKey('S', Keyboard.KEY_S, 15, 43);
    drawKey('D', Keyboard.KEY_D, 28, 43);
});

```

Для того, чтобы скомпилировать скрипт:
```
cristalix-bundler keystrokes.ts
```

Файл `build/clientcode.bundle.js` нужно перетащить в папку `scripts` в клиенте.
