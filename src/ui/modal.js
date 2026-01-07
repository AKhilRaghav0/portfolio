// Modal System for Portfolio Content
export function showModal(title, content) {
    // Check if modal already exists
    if (document.getElementById("game-modal")) return;

    const modal = document.createElement('div');
    modal.id = "game-modal";
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'rgba(20, 20, 20, 0.95)';
    modal.style.border = '2px solid #fff';
    modal.style.padding = '30px';
    modal.style.zIndex = '10000';
    modal.style.minWidth = '400px';
    modal.style.maxWidth = '80%';
    modal.style.maxHeight = '80vh';
    modal.style.overflowY = 'auto';
    modal.style.color = '#fff';
    modal.style.fontFamily = "'Poppins', sans-serif";
    modal.style.boxShadow = "0 0 20px rgba(0,0,0,0.8)";
    modal.style.borderRadius = "8px";

    const closeBtn = document.createElement('button');
    closeBtn.innerText = "CLOSE [ESC]";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "1px solid #fff";
    closeBtn.style.color = "#fff";
    closeBtn.style.padding = "5px 10px";
    closeBtn.style.cursor = "pointer";

    const titleEl = document.createElement('h1');
    titleEl.innerText = title;
    titleEl.style.marginTop = "0";
    titleEl.style.color = "#fec830"; // Gold color
    titleEl.style.borderBottom = "1px solid #555";
    titleEl.style.paddingBottom = "10px";

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = content;
    contentDiv.style.lineHeight = "1.6";

    // Style links if any
    const style = document.createElement('style');
    style.innerHTML = `
        #game-modal a { color: #58a6ff; text-decoration: none; }
        #game-modal a:hover { text-decoration: underline; }
    `;
    modal.appendChild(style);

    modal.appendChild(closeBtn);
    modal.appendChild(titleEl);
    modal.appendChild(contentDiv);

    document.body.appendChild(modal);

    // Pause Game
    window.gameInstance.debug.paused = true;

    function closeModal() {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
            window.gameInstance.debug.paused = false;
        }
    }

    closeBtn.onclick = closeModal;

    // Close on Escape
    const escListener = (e) => {
        if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", escListener);
        }
    };
    document.addEventListener("keydown", escListener);
}
