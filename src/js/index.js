import fetchImages from "./fetchImages";
import { Notify } from "notiflix";
import simpleLightbox from "simplelightbox";
import { throttle } from "lodash";
import "simplelightbox/dist/simple-lightbox.min.css";

const { searchForm, gallery, loadMoreBtn, endCollectionText } = {
searchForm: document.querySelector('.search-form'),
gallery: document.querySelector('.gallery'),
loadMoreBtn: document.querySelector('.load-more'),
endCollectionText: document.querySelector('end-collection-text'),
};
function creatImageCard(cards) {
const markup = cards
.map(
image =>
`<div class='photo-card'>
<a href='${image.largeImageURL}'>
<img src='${image.webformatURL}' alt='${image.tags}' loading='lazy' />
</a>
<div class='info'>
<p class='info-item'>
<b>Likes</b>
${image.likes}
</p>
<p class='info-item'>
<b>Views</b>
${image.views}
</p>
<p class='info-item'>
<b>Comments</b>
${image.comments}
</p>
<p class='info-item'>
<b>Downloads</b>
${image.downloads}
</p>
</div>
</div>`
)
.join('');
gallery.insertAdjacentHTML('beforeend', markup);
}
let lightbox = new simpleLightbox('.photo-card a', {
captions: true,
captionsData: 'alt',
captionsDelay: 250,
});
let currentPage = 1;
let currentHits = 0;
let searchQuery = '';
searchForm.addEventListener('submit', onSubmitSearchForm);
//   function onSubmitSearchForm(e) {
//     e.preventDefault();
//     searchQuery = e.currentTarget.searchQuery.value;
//     currentPage = 1;
//     if (searchQuery === '') {
//       return;
//     }
//     fetchImages(searchQuery, currentPage).then(response => {
//       currentHits = response.hits.length;
//       if (response.totalHits > 40) {
//         loadMoreBtn.classList.remove('is-hidden');
//       } else {
//         loadMoreBtn.classList.add('is-hidden');
//       }
//       try {
//         if (response.totalHits > 0) {
//           Notify.success(`Hooray! We found ${response.totalHits} images.`);
//           gallery.innerHTML = '';
//           creatImageCard(response.hits);
//           lightbox.refresh();
//           endCollectionText.classList.add('.is-hidden');
//           const { height: cardHeight } = document
//             .querySelector('.gallery')
//             .firstElementChild.getBoundingClientRect();
//           window.scrollBy({
//             top: cardHeight * -100,
//             behavior: 'smooth',
//           });
//         }
//         if (response.totalHits === 0) {
//           gallery.innerHTML = '';
//           Notify.failure(
//             'Sorry, there are no images matching your search query. Please try again.'
//           );
//           loadMoreBtn.classList.add('.is-hidden');
//           endCollectionText.classList.add('.is-hidden');
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     });
//   }

function onSubmitSearchForm(e) {
e.preventDefault();
searchQuery = e.currentTarget.searchQuery.value;
currentPage = 1;
if (searchQuery === '') {
return;
}
fetchImages(searchQuery, currentPage).then(response => {
currentHits = response.hits.length;
if (response.totalHits > 40) {
loadMoreBtn.classList.remove('is-hidden');
} else {
loadMoreBtn.classList.add('is-hidden');
}
if (response.totalHits > 0) {
Notify.success(`Hooray! We found ${response.totalHits} images.`);
gallery.innerHTML = '';
creatImageCard(response.hits);
lightbox.refresh();
endCollectionText.classList.add('.is-hidden');
const { height: cardHeight } = document
.querySelector('.gallery')
.firstElementChild.getBoundingClientRect();
window.scrollBy({
top: cardHeight * -100,
behavior: 'smooth',
});
}
if (response.totalHits === 0) {
gallery.innerHTML = '';
Notify.failure(
'Sorry, there are no images matching your search query. Please try again.'
);
loadMoreBtn.classList.add('.is-hidden');
endCollectionText.classList.add('.is-hidden');
}
});
}
loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);
async function onClickLoadMoreBtn() {
currentPage += 1;
const response = await fetchImages(searchQuery, currentPage);
creatImageCard(response.hits);
lightbox.refresh();
currentHits += response.hits.length;
if (currentHits === response.totalHits) {
loadMoreBtn.classList.add('.is-hidden');
endCollectionText.classList.remove('.is-hidden');
}
}