const TASK_FUNCS = {
    task1(input) {
        function randInt(min, max) {
            return min + (Math.random() * (max - min)) | 0;
        }

        function getRandomValue(values) {
            let index = randInt(0, values.length);
            return values[index];
        }
        const numbers = '0123456789';
        const lettersLow = 'abcdefghijklmnopqrstuvwxyz';
        const lettersUp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const resultLength = randInt(6, 20 + 1);

        let res = getRandomValue(numbers) + getRandomValue(lettersLow) + getRandomValue(lettersUp);
        while (res.length < resultLength) {
            let variant = randInt(1, 3);
            switch (variant) {
                case 1:
                    res += getRandomValue(numbers);
                    break;
                case 2:
                    res += getRandomValue(lettersLow);
                    break;
                case 3:
                    res += getRandomValue(lettersUp);
                    break;
            }
        }

        return res;
    },
    task2(input) {
        let queue = Array.from({length: input.count}, (_, i) => i + 1);
        for(let step = 1; queue.length > 1 ;step++) {
            let cur = queue.shift();
            if(step % input.step == 0) {
                step = 0;
                continue;
            }
            queue.push(cur);
        }
        return queue.shift();
    },
    task3(input) {
        if (input < 0) {
            let temp = TASK_FUNCS.task3(-input);
            return `1/(${temp})`;
        }
        if (input == 0) {
            return '1';
        }

        if (!input || !Number.isInteger(input) || input < -200 || input > 200) {
            return 'Invalid input';
        }

        function factor(n) {
            factor.mem = factor.mem || {};
            if (factor.mem[n]) return factor.mem[n];

            let res = BigInt(1);
            for (let i = 2; i <= n; i++) {
                res *= BigInt(i);
            }
            return factor.mem[n] = res;
        }

        function coeff(n, k) {
            return factor(n) / (factor(k) * factor(n - k));
        }

        function powStr(letter, pow) {
            return pow == 1 ? letter : `${letter}^${pow}`;
        }

        let result = powStr('a', input);
        for (let i = 1; i < input; i++) {
            let c = coeff(input, i);
            c = c == 1 ? '' : c;
            const a = powStr('a', input - i);
            const b = powStr('b', i);

            result += `+${c}${a}${b}`;
        }
        result += `+${powStr('b', input)}`;

        return result;
    },
};