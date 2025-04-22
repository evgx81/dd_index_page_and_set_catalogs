import { derived, writable } from "svelte/store";


/**
* Показывает, является ли текущая страница главной
* @type {import("svelte/store").Writable<boolean>}
*/
export const is_index_page = writable(true);

/**
 * Хранит о сетах товаров с изображениями
 * @type {import("svelte/store").Writable<Array.<{id: string, video: string, poster_image: string, images: Array.<string>, total_price: number, products: Array.<{image:string}>, is_liked: boolean}>>}
 */
export const product_sets = writable([]);

// /**
//  * Хранит о сетах товаров с изображениями
//  * @type {import("svelte/store").Writable<Array.<Array.<{id: string, video: string, poster_image: string, images: Array.<string>, total_price: number, products: Array.<{image:string}>, is_liked: boolean}>>>}
//  */
// export const product_sets_data = writable([]);

/**
* Количество сетов, которое содержится в каждом наборе сетов на странице
* @type {import("svelte/store").Writable<number>}
*/
export const current_sets_number = writable(20);


function splitArrayToChunks(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

/**
 * Возвращает массив сетов, разбитый на массивы из 20 сетов
 * @type {import("svelte/store").Readable<Array.<Array.<{id: string, video: string, poster_image: string, images: Array.<string>, total_price: number, products: Array.<{image:string}>, is_liked: boolean}>>>}
 */
export const product_sets_chunks = derived([product_sets, current_sets_number], ([$product_sets, $current_sets_number]) => splitArrayToChunks($product_sets, $current_sets_number));


/**
 * Хранит данные о типах сета в хедере
 * @type {import("svelte/store").Writable<Array.<{id: string, image: string}>>}
 */
export const page_header_data = writable([]);

/**
 * Хранит о данные о сетах пользователя
 * @type {import("svelte/store").Writable<{id: string, email: string, first_name: string, last_name: string}>}
 */
export const user_data = writable({ id: "", email: "", first_name: "", last_name: "" });


/**
* Показывает, авторизован ли пользователь
* @type {import("svelte/store").Readable<boolean>}
*/
export const is_authenticated = derived(user_data, ($user_data) => {
    return $user_data.email !== "";
});

/**
 * Хранит данные о заголовке каталога товаров
 * @type {import("svelte/store").Writable<{title: string}>}
 */
export const catalog_title = writable({ title: "" });

/**
* Количество сетов лайкнутых пользователем
* @type {import("svelte/store").Writable<{number_of_favourite_sets: number}>}
*/
export const number_of_favourite_sets_data = writable({ number_of_favourite_sets: 0 });

/**
 * Получает значение ключа из куки
 * @param {string} name - значение ключа
 */
export const getCookie = (name) => {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=')
        return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '')
}

/**
 * Получает количество лайкнутых сетов пользователем
 * @param {string} token - значение токена пользователя
 */
export async function getUserNumberFavouriteSets(token) {
    try {
        const resp = await fetch("/users/user/favourite_sets/", {
            headers: {
                Authorization: token,
            },
        });
        if (!resp.ok) {
            throw new Error(`Response status: ${resp.status}`);
        }

        const data = await resp.json();
        number_of_favourite_sets_data.set(data);
    } catch (error) {
        console.error(error.message);
    }
}


