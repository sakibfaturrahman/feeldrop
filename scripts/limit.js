async function loadMenfess() {
  try {
    const res = await fetch("/menfess/limit");
    const data = await res.json();

    // get 20 data anyar
    const latest20 = data.slice(0, 20);
    const top10 = latest20.slice(0, 10);
    const bottom10 = latest20.slice(10);

    const topWrapper = document.getElementById("marqueeTop");
    const bottomWrapper = document.getElementById("marqueeBottom");

    topWrapper.innerHTML = "";
    bottomWrapper.innerHTML = "";

    const createCard = (item) => {
      const slide = document.createElement("div");
      slide.className =
        "min-w-[300px] sm:min-w-[340px] max-w-[340px] h-[230px] flex-shrink-0 border rounded-[20px] shadow-sm overflow-hidden bg-white flex flex-col";

      slide.innerHTML = `
          <div class="p-4 flex-1 flex flex-col">
            <div class="mb-2">
              <span class="block font-semibold text-sm">To: ${item.to}</span>
            </div>
            <p class="font-handwriting text-[30px] sm:text-[30px] text-gray-800 overflow-hidden text-ellipsis line-clamp-4">
              ${item.message}
            </p>
          </div>
          <div class="px-3 py-2 bg-[#f1f2f4] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img
                src="${item.song.coverUrl}"
                alt="Album Art"
                class="w-9 h-9 rounded-[12px] object-cover"
              />
              <div>
                <strong class="text-sm">${item.song.title}</strong><br />
                <span class="text-xs text-gray-700">${item.song.artist}</span>
              </div>
            </div>
            <a href="${item.song.url}" target="_blank">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
                alt="spotify"
                class="w-5 h-5"
              />
            </a>
          </div>
        `;
      return slide;
    };

    // looping infinite scroll
    const topItems = [...top10, ...top10];
    const bottomItems = [...bottom10, ...bottom10];

    topItems.forEach((item) => topWrapper.appendChild(createCard(item)));
    bottomItems.forEach((item) => bottomWrapper.appendChild(createCard(item)));
  } catch (err) {
    console.error("❌ Gagal load menfess:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadMenfess);
