(() => {
    const {
        AsyncArray,
        add
    } = Homework;
    
    const promisify = (func, ...args) => {
        return new Promise((resolve, reject) => {
            func(...args, resolve);
        });
    };
    
    // Проверка размеров массивов на корректность
    async function checkVectorsLength(vec1, vec2) {
        const [vecLength1, vecLength2] = await Promise.all([
            promisify(vec1.length),
            promisify(vec2.length)
        ]);
    
        if (vecLength1 === 0 || vecLength2 === 0) {
            throw "Vectors must have at least one value!"
        }
    
        if (vecLength1 !== vecLength2) {
            throw "Vectors must have the same size!"
        }
    };
    
    async function recursiveVectorsSummation(vec1, vec2, vecSum = new AsyncArray(), vecLength = null, index = 0) {
        // Длина массива
        if (vecLength === null) {
            vecLength = await Promise.all([
                promisify(vec1.length),
                promisify(vec2.length)
            ])
            vecLength = Math.min(...vecLength);
        }
        
        // Условие выхода из рекурсии
        if (index === vecLength) {
            return vecSum;
        }
    
        // Получаем по числу из каждого массива
        let [vecNum1, vecNum2] = await Promise.all([
            promisify(vec1.get, index),
            promisify(vec2.get, index)
        ]);
        
        // Складываем полученные числа
        let numSum = await promisify(add, vecNum1, vecNum2);
    
        // Записываем сумму в нужную ячейку vecSum
        await promisify(vecSum.set, index, numSum);
        
        // Увеличиваем индекс на 1
        index = await promisify(add, index, 1);

        // Рекурсивно повторям операции выше, но с увеличенным индексом
        return recursiveVectorsSummation(vec1, vec2, vecSum, vecLength, index);
    };
    
    window.sumVectors = (vec1, vec2, callback) => {
        // Проверяем длины векторов и запускаем рекурсивное суммирование
        checkVectorsLength(vec1, vec2).then(() => {
            return recursiveVectorsSummation(vec1, vec2);
        }).then(callback);
    };
})();