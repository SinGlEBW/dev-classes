# Changelog

## [1.3.28] - 2025-08-12

### Added
- Добавлен type SocketApi_StatusConnect_OR

### Changed
- Изменено поведение DelaysPromiseProps['startActionEvery']. 
   На практике: При покидании компонента операция продолжаеться и дублируеться если снова зайти на компонент. 

```tsx
useEffect(() => {
    reqGosUslugi();
    const controlStartActionEvery = controlDelay.startActionEvery(() => {
    let isAuth = getStatusAuth(store.getState());
    if(!isAuth){ 
        reqGosUslugi();
        return false;
    }
    return true;
    }, {interval: 20000})

    controlStartActionEvery.promise
    .then((control) => {})
    .catch(() => {})
    return () => {
        controlStartActionEvery.stop();//можно указать boolean статус будет отрабатывать then | catch по завершению
    }
}, []
```
   
## [1.3.29] - 2025-08-12
### Added
- Добавлен метод SocketApi.getRequestSave

## [1.3.30] - 2025-08-12
### Fixed
- Отображение событий SocketApi.on

## [1.3.31] - 2025-08-12
### Added
- Добавлен проброс типов generetic types в controlDelay.oneOfPromise & controlDelay.oneOf 

## [1.3.32] - 2025-08-15
### Fixed
- Исправлен формат отправки сообщений через SocketApi.send 

## [1.3.33] - 2025-08-16
### Fixed
- Исправлено возвращаемое значение в HTTPSApi.request

## [1.3.35] - 2025-08-18
### Fixed
- Исправлено ожидание статуса close при вызове SocketApi.close()

## [1.4.1] - 2025-08-19
### Remove
- Перенос пакета SocketApi в отдельную библиотеку lib-socket-api для последующего исользования в связке с компонентами react в библиотеке  rc-lib-ui

## [1.4.10] - 2025-08-26
### Added
- NetworkStatusTracker
### Fixed
- EventSubscribers.resetSubscribers

## [1.4.11] - 2025-08-27
### Changed
- Изменены зависимости peerDependencies

## [1.4.12] - 2025-08-28
### Fixed
- Мелкие изменения типов

## [1.4.13] - 2025-08-28
### Changed
- HTTPSApi: Частичный перевод ошибок на русский для запросов через http cordova
## [1.4.14] - 2025-08-28
### Added
- Color: добавлен метод isHex
## [1.4.15] - 2025-08-28
### Change
- Color: hexaToRgba добавлен параметр isNormalizeAlpha приводит альфу из #456789aa [69, 103, 137, 0.67] иначе альфа 170
## [1.4.16] - 2025-09-26
### Added
- Utils: sortByOnline и filterItems добавлено 2 метода
## [1.4.18] - 2025-11-19
### Added
- Color: generateHex generateHexMultiple
