// ES6 or TypeScript:
import * as cheerio from 'cheerio';

const extract_interventions = (html: string) : [] => {
    const $ = cheerio.load(html); 
    const res = []; 
    const get_intervention_types = () => {
        return $('.carousel-container'); 
    }
 
    let intervention_types = get_intervention_types();  
    intervention_types.each((idx, typ) => {
        let entry = {
            'category': $(typ).find('.caption').text(),
            'interventions': []
        } 
        $(typ).find('.carousel-item').each((j, intervention) => {            
            const imgs = $(intervention).find('img');
            imgs.each((n, img) => {
                let obj = {
                    'src': $(img).attr('src'),
                    'alt': $(img).attr('alt'),
                    'title': $(img).attr('title'),
                }
                entry.interventions.push(obj);
            }); 
        }); 
        res.push(entry);
    });
    return res; 
    //     // define function which accepts body and cheerio as args
    // function extract(input, cheerio) {
    //     // return object with extracted values              
    //     let $ = cheerio.load(input);
    //   	let types = $('.carousel-container'); 
    //   console.log('types', types)
    //   types.each((i, elem, x, y) => {
    // 	//parsedItems.push($(elem).text());
    //     console.log('EL', $(elem).text(), i, x, y)
    //    	console.log('Title', $(elem).find('.caption').text()) 
    //     let kids = $(elem).find('.carousel-item');
    //     kids.each((j, kid) => {
    //     	console.log('KID', $(kid))
    //       	let imgs = $(kid).find('img')
    //         imgs.each((z, im) => {
    //         	console.log('Src', $(im).attr('src'))
    //         });
    //     });
    // });
    //   console.log('NEW')
    //   	types.map((i, itm) => {
    //       console.log('ITEM', itm)
    //     	/*let res = $(itm).find('div');
    //         console.log('RES:',res)
    //       	res.map((j)=> {
    //         	console.log('RES2:',j)
    //         });*/
    //     });
    //     return {
    //         title: $('div.carousel-inner').text().trim()
    //     };
    // }
}

// import * as htmlparser2 from "htmlparser2";

// const extract_interventions = (html: string) => {
//     const dom = htmlparser2.parseDocument(html);
// }
// const interventions = [];
// let curr_interventions = {
//     'title': '',
//     'interventions': []
// }
// let get_kids = false;
// let in_parent_container = false;
// let in_inner_container = false;
// let is_intervention = false;

// const parser = new htmlparser2.Parser({
//     onopentag(name, attributes) {
//         /*
//          * This fires when a new tag is opened.
//          *
//          * If you don't need an aggregated `attributes` object,
//          * have a look at the `onopentagname` and `onattribute` events.
//          */
//         if (name === "script" && attributes.type === "text/javascript") {
//             console.log("JS! Hooray!");
//         }
//         // if(name === 'div' && in_container)
//         if(name === 'a' && is_intervention) {

//         }
//     },
//     onattribute(name, value) {
//         if(name === 'class' && value === 'carousel-container') {
//             in_parent_container = true;
//         }
//         if(name === 'class' && value === 'carousel-inner') {
//             in_inner_container = true;
//         }
//         if(name === 'class' && value === 'carousel-item') {
//             is_intervention = true;
//         }
//         if(name === 'img' && is_intervention) {

//         }
//     },
//     ontext(text) {
//         /*
//          * Fires whenever a section of text was processed.
//          *
//          * Note that this can fire at any point within text and you might
//          * have to stitch together multiple pieces.
//          */
//         console.log("-->", text);
//     },
//     onclosetag(tagname) {
//         /*
//          * Fires when a tag is closed.
//          *
//          * You can rely on this event only firing when you have received an
//          * equivalent opening tag before. Closing tags without corresponding
//          * opening tags will be ignored.
//          */
//         if (tagname === "script") {
//             console.log("That's it?!");
//         }
//         if(tagname === 'div' && in_inner_container) {

//         }
//     },
// });

export { extract_interventions }