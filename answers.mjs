const startAnswer =
    "Поздравляю, ты зарегестрирован! Можем начать работу\n"

const commands =
    "Команды:\n" +
    "/info - информация о подключённых группах\n" +
    "(/connect доменное_имя_группы) - подключить сообщество (кол-во участников должно быть меньше 15000)\n" +
    "(/check доменное_имя_группы) - проверить группу на изменение кол-ва подписчиков\n" +
    "(/delete доменное_имя_группы) - отключиться от группы\n"

const startWrongAnswer = "Что-то пошло не так, я уже зарегестрировал тебя!"

const groupNotExists = "Такой группы не  существует. Проверте доменное имя ещё раз или удостовертесь, что группа открыта"

const groupAlreadyConnected = "Эта группа уже подключена"

const groupsNotConnected = "У тебя нет подключенных групп("

const groupNotFound = "Не существует подключенной группы с таким именем!\n/info - подробнее"

const groupLimited = "уже подключена у 2-х пользователей! В данный момент невозможно подключение сообщества к большому количеству аккаунтов. Извините за неудобство("

const noChanges = "Изменений не наблюдается)"

export {startAnswer, startWrongAnswer, groupNotExists, groupAlreadyConnected, groupLimited, groupsNotConnected, groupNotFound, noChanges, commands}