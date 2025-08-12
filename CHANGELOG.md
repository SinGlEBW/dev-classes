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

