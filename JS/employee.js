document.addEventListener("DOMContentLoaded", init);

function init() {
    setupNavigation();
    setupModal();
    setupTicketForm();
}

/* ===============================
   SPA NAVIGATION
================================ */
function setupNavigation() {
    const contents = document.querySelectorAll(".content");
    const menuLinks = document.querySelectorAll(".menu a[data-target]");

    function showPage(targetId) {
        contents.forEach(section => {
            section.classList.remove("active");
        });

        const target = document.getElementById(targetId);
        if (target) target.classList.add("active");

        menuLinks.forEach(link => {
            link.classList.remove("active");
        });

        const activeLink = document.querySelector(
            `.menu a[data-target="${targetId}"]`
        );

        if (activeLink) activeLink.classList.add("active");
    }

    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            showPage(targetId);
        });
    });
}

/* ===============================
   MODAL LOGIC
================================ */
function setupModal() {
    const modal = document.getElementById("ticketModal");
    const openBtn = document.querySelector(".create-ticket");
    const closeBtn = document.querySelector(".close-modal");
    const cancelBtn = document.querySelector(".cancel-btn");

    if (!modal) return;

    openBtn?.addEventListener("click", () => {
        modal.classList.add("active");
    });

    closeBtn?.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    cancelBtn?.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });
}

/* ===============================
   TICKET FORM + AUTO RENDER
================================ */
function setupTicketForm() {
    const form = document.getElementById("createTicketForm");
    const tableBody = document.querySelector(".ticket-table tbody");
    const modal = document.getElementById("ticketModal");

    if (!form || !tableBody) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        const title = formData.get("title");
        const priority = formData.get("priority");
        const dueDate = formData.get("dueDate");
        const estimatedTimeRaw = formData.get("estimatedTime");

        let formattedEstimatedTime = "-";
            
        if (estimatedTimeRaw) {
            const [hours, minutes] = estimatedTimeRaw.split(":");
        
            let hour = parseInt(hours);
            const ampm = hour >= 12 ? "PM" : "AM";
        
            hour = hour % 12;
            hour = hour ? hour : 12; // 0 becomes 12
        
            formattedEstimatedTime = `${hour}:${minutes} ${ampm}`;
        }

        // Get full date + time
        const now = new Date();
        const createdDateTime = now.toLocaleDateString() + " " + 
                                now.toLocaleTimeString();

        const priorityClass = priority
            ? priority.toLowerCase().replace(/\s+/g, "-")
            : "low";

        const ticketNumber = "TCK-" + Math.floor(Math.random() * 10000);

        renderTicket({
            ticketNumber,
            title,
            priority,
            priorityClass,
            dueDate,
            estimatedTime: formattedEstimatedTime,
            createdDateTime
        });

        form.reset();
        modal?.classList.remove("active");
    });
}

/* ===============================
   RENDER FUNCTION (Reusable)
================================ */
function renderTicket(ticket) {
    const tableBody = document.querySelector(".ticket-table tbody");
    if (!tableBody) return;

    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${ticket.ticketNumber}</td>
        <td>${ticket.title}</td>
        <td>
            <span class="badge priority-${ticket.priorityClass}">
                ${ticket.priority}
            </span>
        </td>
        <td>
            <span class="badge status-open">Open</span>
        </td>
        <td>${ticket.dueDate || "-"}</td>
        <td>${ticket.estimatedTime || "-"}</td>
        <td>${ticket.createdDateTime}</td>
        <td>
            <button class="action-btn">View</button>
        </td>
    `;

    tableBody.prepend(newRow);
}