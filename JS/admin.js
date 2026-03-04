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

    if (openBtn) {
        openBtn.addEventListener("click", () => {
            modal.classList.add("active");
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("active");
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            modal.classList.remove("active");
        });
    }

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
        const assignedTo = formData.get("assignedTo");
        const dueDate = formData.get("dueDate");

        const createdDate = new Date().toISOString().split("T")[0];

        // Sanitize class (important if value has spaces)
        const priorityClass = priority
            ? priority.toLowerCase().replace(/\s+/g, "-")
            : "low";

        const ticketNumber = "TCK-" + Math.floor(Math.random() * 10000);

        renderTicket({
            ticketNumber,
            title,
            priority,
            priorityClass,
            assignedTo,
            dueDate,
            createdDate
        });

        form.reset();

        if (modal) modal.classList.remove("active");
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
        <td>${ticket.assignedTo}</td>
        <td>${ticket.dueDate || "-"}</td>
        <td>${ticket.createdDate}</td>
        <td>
            <button class="action-btn">View</button>
        </td>
    `;

    tableBody.prepend(newRow);
}