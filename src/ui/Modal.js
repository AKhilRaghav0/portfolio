// Modal System for Portfolio Content
export function showModal(title, content) {
    // Check if modal already exists
    if (document.getElementById("game-modal")) return;

    const modal = document.createElement('div');
    modal.id = "game-modal";
    modal.className = "interactive";
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'rgba(10, 10, 20, 0.95)';
    modal.style.border = '2px solid #00ffff'; // Cyan border
    modal.style.padding = '30px';
    modal.style.zIndex = '10000';
    modal.style.minWidth = '400px';
    modal.style.maxWidth = '80%';
    modal.style.maxHeight = '80vh';
    modal.style.overflowY = 'auto';
    modal.style.color = '#fff';
    modal.style.fontFamily = "'Rajdhani', sans-serif";
    modal.style.boxShadow = "0 0 20px #00ffff"; // Neon glow
    modal.style.borderRadius = "2px";

    const closeBtn = document.createElement('button');
    closeBtn.innerText = "CLOSE [ESC]";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "1px solid #00ffff";
    closeBtn.style.color = "#00ffff";
    closeBtn.style.padding = "5px 10px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontFamily = "inherit";

    const titleEl = document.createElement('h1');
    titleEl.innerText = title;
    titleEl.style.marginTop = "0";
    titleEl.style.color = "#ff00ff"; // Pink title
    titleEl.style.textShadow = "0 0 5px #ff00ff";
    titleEl.style.borderBottom = "1px solid #555";
    titleEl.style.paddingBottom = "10px";
    titleEl.style.textTransform = "uppercase";

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = content;
    contentDiv.style.lineHeight = "1.6";
    contentDiv.style.fontSize = "1.2rem";

    // Style links if any
    const style = document.createElement('style');
    style.innerHTML = `
        #game-modal a { color: #00ffff; text-decoration: none; border-bottom: 1px dashed #00ffff; }
        #game-modal a:hover { color: #fff; text-shadow: 0 0 5px #00ffff; }
        #game-modal p { margin-bottom: 15px; }
    `;
    modal.appendChild(style);

    modal.appendChild(closeBtn);
    modal.appendChild(titleEl);
    modal.appendChild(contentDiv);

    document.getElementById('ui-layer').appendChild(modal);

    // Pause Game Logic if exposed
    // window.engine.paused = true;

    function closeModal() {
        if (document.getElementById("game-modal")) {
            document.getElementById('ui-layer').removeChild(modal);
            // window.engine.paused = false;
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
