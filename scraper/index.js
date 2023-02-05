import fs from 'fs-extra';
import fetch from 'node-fetch';
import { JSDOM } from "jsdom";

async function dorar(file, page) {

    fs.existsSync('./database') ? true :
        fs.mkdirsSync('./database', { recursive: true });

    fs.existsSync(`./database/${file}.json`) ? true :
        fs.writeJSONSync(`./database/${file}.json`, [], { spaces: '\t' });


    let readJson = fs.readJsonSync(`./database/${file}.json`)
    let num = 1



    for (let indexx = 1; indexx <= page; indexx++) {

        let response = await fetch(`https://dorar.net/history/?page=${indexx}`);
        let body = await response?.text();

        let dom = new JSDOM(body);
        global.document = dom.window.document
        global.window = dom.window

        if (response?.status === 200) {

            let title = Array.from(document.querySelectorAll('#accordionEx > div > div > a > h6 > div')).map(e => {

                return e.textContent.trim()
            }).filter(e => {

                let arr = [
                    "موسوعة التفسير",
                    "الموسوعة الحديثية",
                    "الموسوعة العقدية",
                    "موسوعة الأديان",
                    "موسوعة الفرق",
                    "الموسوعة الفقهية",
                    "موسوعة الأخلاق",
                    "الموسوعة التاريخية",
                    "موسوعة اللغة العربية"

                ]
                if (!arr.some(item => e === item)) {
                    return e
                }
            });


            let text = Array.from(document.querySelectorAll('#accordionEx > div > div > div > p')).map(e => {

                return e.textContent.replace(/\n|\t/g, '').trim()

            }).filter(e => {

                let arr = [
                    'منهج العمل في الموسوعة',
                    'راجع الموسوعة',
                    'الشيخ الدكتور خالد بن عثمان السبت',
                    'أستاذ التفسير بجامعة الإمام عبدالرحمن بن فيصل',
                    'الشيخ الدكتور أحمد سعد الخطيب',
                    'أستاذ التفسير بجامعة الأزهر',
                    'اعتمد المنهجية',
                    'بالإضافة إلى المراجعَين',
                    'الشيخ الدكتور عبدالرحمن بن معاضة الشهري',
                    'أستاذ التفسير بجامعة الملك سعود',
                    'الشيخ الدكتور مساعد بن سليمان الطيار',
                    'أستاذ التفسير بجامعة الملك سعود',
                    'الشيخ الدكتور منصور بن حمد العيدي',
                    'أستاذ التفسير بجامعة الإمام عبدالرحمن بن فيصل',
                    'منهج العمل في الموسوعة',
                    'منهج العمل في الموسوعة',
                    'منهج العمل في الموسوعة',
                    'منهج العمل في الموسوعة',
                    'منهج العمل في الموسوعة',
                    'تم اعتماد المنهجية من                           الجمعية الفقهية السعودية                                                          برئاسة الشيخ الدكتور                           سعد بن تركي الخثلان                           أستاذ الفقه بجامعة الإمام محمد بن سعود                                                      عضو هيئة كبار العلماء (سابقاً)',
                    'منهج العمل في الموسوعة',
                    'منهج العمل في الموسوعة',
                    'راجع الموسوعة',
                    'الأستاذُ صالحُ بنُ يوسُفَ المقرِن',
                    'باحثٌ في التَّاريخ الإسْلامِي والمُعاصِر                                                      ومُشْرِفٌ تربَويٌّ سابقٌ بإدارة التَّعْليم',
                    'الأستاذُ الدُّكتور سعدُ بنُ موسى الموسى',
                    'أستاذُ التَّاريخِ الإسلاميِّ بجامعةِ أُمِّ القُرى',
                    'الدُّكتور خالِدُ بنُ محمَّد الغيث',
                    'أستاذُ التَّاريخِ الإسلاميِّ بجامعةِ أمِّ القُرى',
                    'الدُّكتور عبدُ اللهِ بنُ محمَّد علي حيدر',
                    'أستاذُ التَّاريخِ الإسلاميِّ بجامعةِ أمِّ القُرى',
                    'منهج العمل في الموسوعة',
                    'تمَّ تحكيمُ موسوعةِ اللُّغةِ العربيَّةِ من                     مكتبِ لغةِ المستقبلِ للاستشاراتِ اللغويَّةِ                     التابعِ لمعهدِ البحوثِ والاستشاراتِ اللغويَّةِ بـ                                          جامعةِ الملكِ خالد بالسعوديَّةِ'
                ]
                if (!arr.some(item => e === item)) {
                    return e
                }
            });

            for (let [index, value] of title.entries()) {

                let title = value;
                let textValue = text[index]
                let date = Array.from(document.querySelectorAll(`#accordionEx > div:nth-child(${index + 1}) > div > div > strong`)).map(e => {

                    return e.textContent.replace(/\n|\s\s|\t/g, '').trim()

                });
                let opt = {
                    id: num++,
                    title: title,
                    date: date,
                    text: textValue
                }

                readJson.push(opt);
                fs.writeJSONSync(`./database/${file}.json`, readJson, { spaces: '\t' })
            }

        }

        else {
            console.log('\n___ ERROR ___\n');
        }

        console.log('page : ', indexx);

    }
}


await dorar('history', 307);
