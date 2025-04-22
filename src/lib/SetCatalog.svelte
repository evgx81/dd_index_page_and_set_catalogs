<script>
  import SetWithImagesSection from "./SetWithImagesSection.svelte";
  import SetWithVideoSection from "./SetWithVideoSection.svelte";
  import {
    getCookie,
    product_sets,
    getUserNumberFavouriteSets,
  } from "./stores";

  /**
   * Обработка события, когда пользователь нажимает на лайк у сета
   */
  async function handleLikeClick(event) {

    // Получаем значение токена пользователя из куки
    let token = getCookie("token");

    // Идентификатор сета, на котором кликнули кнопку "Лайк"
    let set_id = event.detail.set_id;

    // Показывает, активирована ли кнопка "Лайк" на сете
    let is_set_liked = event.detail.is_set_liked;

    if (is_set_liked === false) {

      const resp = await fetch(
        "/products/product_sets/preference/set_like?" +
          new URLSearchParams({ set_id: set_id }).toString(),
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!resp.ok) {
        throw new Error(`Error: ${resp.status}`);
      }

      // Если удалось поставить лайк, то в зависимости от вида полученного сета, ищем в выбранный сет по идентификатору и меняем значение поля "is_liked"
      if (resp.status == 201) {
        let curr_chosen_set = $product_sets.find((set) => set.id === set_id);
        curr_chosen_set.is_liked = true;
      }

    } else {

      const resp = await fetch(
        "/products/product_sets/preference/unset_like?" +
          new URLSearchParams({ set_id: set_id }).toString(),
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!resp.ok) {
        throw new Error(`Error: ${resp.status}`);
      }

      // Если удалось убрать лайк, то в зависимости от вида полученного сета, ищем в выбранный сет по идентификатору и меняем значение поля "is_liked"
      if (resp.status == 204) {
        let curr_chosen_set = $product_sets.find((set) => set.id === set_id);
        curr_chosen_set.is_liked = false;
      }
    }

    product_sets.set($product_sets);
    
    // Получаем обновленное количество лайкнутых сетов
    await getUserNumberFavouriteSets(token);
  }

  /**
   * Сеты товаров, которые выводятся на главной странице
   * @type {Array.<{id: string, video: string, poster_image: string, images: Array.<string>, total_price: number, products: Array.<{image:string}>, is_liked: boolean}>}
   */
  export let curr_product_sets;

  export let product_sets_chunks_num;
</script>

<section
  class={`${product_sets_chunks_num >= 2 ? "section" : "section-video"} ${product_sets_chunks_num >= 2 ? "section-pad-top" : ""} section-pad-bot section-index-4`}
>
  <SetWithVideoSection
    set_with_video={curr_product_sets[0]}
    on:message={handleLikeClick}
  />
</section>

<section class="section section-pad-top section-pad-bot section-index-3">
  <div class="container">
    <div
      class="catalog-sliders catalog-sliders--six-set"
      data-name="slider-parent"
    >
      <SetWithImagesSection
        sets_with_images={curr_product_sets.slice(1, 7)}
        set_with_images_order_num={1}
        on:message={handleLikeClick}
      />
    </div>
  </div>
</section>

<section class="section section-pad-top section-pad-bot section-index-2">
  <div class="container">
    <div
      class="catalog-sliders catalog-sliders--three-set"
      data-name="slider-parent"
    >
      <SetWithImagesSection
        sets_with_images={curr_product_sets.slice(7, 10)}
        set_with_images_order_num={2}
        on:message={handleLikeClick}
      />
    </div>
  </div>
</section>

<section class="section section-pad-top section-pad-bot section-index-1">
  <SetWithVideoSection
    set_with_video={curr_product_sets[10]}
    on:message={handleLikeClick}
  />
</section>

<section class="section section-pad-top section-pad-bot">
  <div class="container">
    <div
      class="catalog-sliders catalog-sliders--six-set"
      data-name="slider-parent"
    >
      <SetWithImagesSection
        sets_with_images={curr_product_sets.slice(11, 17)}
        set_with_images_order_num={3}
        on:message={handleLikeClick}
      />
    </div>
  </div>
</section>

<section class={`section section-pad-top section-pad-bot section-index-1`}>
  <div class="container">
    <div
      class="catalog-sliders catalog-sliders--three-set-reverse"
      data-name="slider-parent"
    >
      <SetWithImagesSection
        sets_with_images={curr_product_sets.slice(17, 20)}
        set_with_images_order_num={4}
        on:message={handleLikeClick}
      />
    </div>
  </div>
</section>
