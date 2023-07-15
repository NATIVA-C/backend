const fs = require('fs');
const path = require('path');

// 将每个元素逐行写入 .md 文件
module.exports = async (allArr, dir, name) => {
    let outPutArr = [];
    let answerArr =[];
    let consecutiveEmptyLines = 0;
    for (let i = 0; i < allArr.length; i++) {
        let txt = allArr[i];
        let preTxt_11 = typeof allArr[i - 1] !== 'undefined' ? allArr[i - 1] : "______NULL------";
        let preTxt_12 = typeof allArr[i - 2] !== 'undefined' ? allArr[i - 2] : "______NULL------";
        let preTxt_01 = typeof allArr[i + 1] !== 'undefined' ? allArr[i + 1] : "______NULL------";
        let preTxt_02 = typeof allArr[i + 2] !== 'undefined' ? allArr[i + 2] : "______NULL------";
        //regex_Logo_1
        if (regex_Logo_1(txt)) {
            outPutArr.push("## " + name.replace(".md", ""));
            continue;
        }

        if (regex_tile_2(txt)) {
            outPutArr.push("");
            continue;
        }

        // Question #2*Topic 1*
        if (regex_content_1(txt)) {
            outPutArr.push(txt.replace(/Question #(\d+)\*Topic (\d+)\*/, '**Question #$1 - Topic $2**'));
            continue;
        }

        if(txt.trim()==='*Community vote distribution*' || txt.trim()==='Community vote distribution'){
            continue;
        }

        if(regex_content_5(txt)){
            continue;
        }

        // References:
        // https://aws.amazon.com/blogs/security/how-to-connect-your-on-premises-active-directory-to-aws-using-ad-connector/
        if ((txt.trim() === 'References:' || txt.trim() === 'Reference:') 
            && regex_content_3(preTxt_11)
            && regex_content_4(preTxt_01)
            && preTxt_12.trim() === ''
            && preTxt_02.trim() === '') {
            continue;
        }

        // References:
        // https://aws.amazon.com/blogs/security/how-to-connect-your-on-premises-active-directory-to-aws-using-ad-connector/
        if ((preTxt_11.trim() === 'References:' ||preTxt_11.trim() === 'Reference:') 
            && regex_content_3(preTxt_12)
            && regex_content_4(txt)
            && preTxt_01.trim() === '') {
            continue;
        }

        //连续两个以上的空行
        if (txt.trim() === '') {
            consecutiveEmptyLines++;
            if (consecutiveEmptyLines >= 2) {
                continue;
            } else {
                outPutArr.push("");
                continue;
            }
        } else {
            consecutiveEmptyLines = 0; // 重置连续空行计数器
        }

        if (regex_content_3(txt)) {
            let j = i;
            while (j < allArr.length) {
                let small = allArr[j];
                answerArr.push(small);
                if (regex_content_1(small)) {
                    break;
                }
                j++;
            }
            let answer = foundCorrectAnswer(answerArr);
            answerArr=[];
            outPutArr.push("**Correct answer : "+"( "+answer+" )**");
            continue;
        }

        if(regex_content_6(txt)){
            outPutArr.push('');
            outPutArr.push(txt);
            outPutArr.push('');
            continue;
        }

        if(regex_content_7(txt)){
            outPutArr.push('- '+txt);
            continue;
        }

        if (regex_content_2(txt)) {
            outPutArr.push(txt);
            continue;
        }

    }

    console.log("-----------------------------------------");
    console.log('转换后：');
    console.log(outPutArr.length);
    const outputPath = path.join(__dirname, "..", "..", "ctd", "tf",dir, name);
    const stream = fs.createWriteStream(outputPath);
    outPutArr.forEach((line) => {
        stream.write(line + '\n');
    });

    stream.end();
    return "文件写入成功";
};

// 匹配logo
const regex_Logo_1 = (txt) => {
    const regex = /\!\[ExamTopics Logo\]\((.*?)\)/;
    return txt.match(regex);
};

//Custom View Settings
const regex_tile_2 = (txt) => {
    regex = /\[ Custom View Settings\]\((.*?)\)/;
    return txt.match(regex);
};

//Question
const regex_content_1 = (txt) => {
    regex = /Question #(\d+)\*Topic (\d+)\*/;
    return txt.match(regex);
};

//content
const regex_content_2 = (txt) => {
    regex = regex = /[,.?]/;
    return regex.test(txt);
};

//Correct Answer:
const regex_content_3 = (txt) => {
    const regex = /\*\*Correct Answer:\*\* \*(.*?)\*/;
    return txt.match(regex);
};

//https
const regex_content_4 = (txt) => {
    const regex = /^https:\/\/.*$/;
    return txt.match(regex);
};

// CE (67%) E (40%)
const regex_content_5 = (txt) => {
    const regex = /^\w+\s+\(\d+%\)$/;
    return txt.match(regex);
};


// imgs
const regex_content_6 = (txt) => {
    const regex = /!\[img\]\((https:\/\/www\.examtopics\.com.+)\)/;
    return txt.match(regex);
};

// A. B.
const regex_content_7 = (txt) => {
    const regex = /^(?:[A-Z]\.)$/;
    return txt.match(regex);
};


// foundCorrectAnswer
const foundCorrectAnswer = (valuesList) => {
    let foundCommunityVote = false;
    let correctAnswer = '';

    for (let i = 0; i < valuesList.length; i++) {
        const value = valuesList[i];

        if (value === '*Community vote distribution*') {
            foundCommunityVote = true;
        } else if (value.startsWith('**Correct Answer:**')) {
            let regex = /\*\*Correct Answer:\*\* \*([^*]+)\*/;
            correctAnswer = value.match(regex)[1].trim();
        }
    }

    if (foundCommunityVote) {
        let maxPercentage = 0;
        let answerWithMaxPercentage = '';

        for (let i = 0; i < valuesList.length; i++) {
            const value = valuesList[i];

            if (value.includes('(') && value.includes(')')) {
                const regex = /([A-Z]+)\s+\((\d+)%\)/;
                const matches = value.match(regex);

                if (matches) {
                    const answer = matches[1];
                    const percentage = parseInt(matches[2], 10);

                    if (percentage > maxPercentage) {
                        maxPercentage = percentage;
                        answerWithMaxPercentage = answer;
                    }
                }
            }
        }

        return answerWithMaxPercentage;
    } else {
        return correctAnswer;
    }
    
};