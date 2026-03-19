document.addEventListener("DOMContentLoaded", init);

function init() {
    setupNavigation();
    setupModal();
    setupTicketForm();
    setupUserModal();
    setupViewTicketModal(); // ADDED
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
        const assignedTo = formData.get("assignedTo");
        const departmentName = formData.get("departmentName");
        const slaName = formData.get("slaName");
        const dueDate = formData.get("dueDate");
        const estimatedTime = formData.get("estimatedTime");
        const description = formData.get("description");

        const formattedEstimatedTime = estimatedTime || "-";

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
            assignedTo,
            departmentName,
            slaName,
            dueDate,
            estimatedTime: formattedEstimatedTime,
            createdDateTime,
            description
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

    /* ADDED: store ticket data */
    newRow.dataset.ticketNumber = ticket.ticketNumber;
    newRow.dataset.title = ticket.title;
    newRow.dataset.priority = ticket.priority;
    newRow.dataset.status = "Open";
    newRow.dataset.assigned = ticket.assignedTo;
    newRow.dataset.department = ticket.departmentName;
    newRow.dataset.sla = ticket.slaName || "";
    newRow.dataset.due = ticket.dueDate;
    newRow.dataset.estimated = ticket.estimatedTime;
    newRow.dataset.created = ticket.createdDateTime;
    newRow.dataset.description = ticket.description;

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
        <td>${ticket.departmentName}</td>
        <td>${ticket.slaName || "-"}</td>
        <td>${ticket.dueDate || "-"}</td>
        <td>${ticket.estimatedTime || "-"}</td>
        <td>${ticket.createdDateTime}</td>
        <td>
            <button class="action-btn view-ticket">View</button>
        </td>
    `;

    tableBody.prepend(newRow);
}


/* ===============================
   USER MODAL
================================ */

function setupUserModal(){

    const modal = document.getElementById("userModal");
    const openBtn = document.querySelector(".create-user");
    const closeBtn = document.querySelector(".close-user-modal");
    const cancelBtn = document.querySelector(".btn-cancel-user");
    const form = document.getElementById("createUserForm");
    const tableBody = document.querySelector(".user-table tbody");

    if(!modal) return;

    openBtn.addEventListener("click", () => {
        modal.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    cancelBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    modal.addEventListener("click", (e) => {
        if(e.target === modal){
            modal.classList.remove("active");
        }
    });

    // Handle form submission
    form?.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const surname = formData.get("surname");
        const firstname = formData.get("firstname");
        const email = formData.get("email");
        const position = formData.get("position");

        // Generate user ID
        const userId = "USR-" + String(Math.floor(Math.random() * 10000)).padStart(3, "0");

        renderUser({
            id: userId,
            surname,
            firstname,
            email,
            position,
            status: "Active"
        });

        form.reset();
        modal.classList.remove("active");
    });

}

/* ===============================
   RENDER USER FUNCTION
================================ */
function renderUser(user) {
    const tableBody = document.querySelector(".user-table tbody");
    if (!tableBody) return;

    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${user.id}</td>
        <td>${user.surname}</td>
        <td>${user.firstname}</td>
        <td>${user.email}</td>
        <td>${user.position}</td>
        <td>
            <button class="view-user-btn">
                <i class="fa-regular fa-eye"></i> View
            </button>
        </td>
    `;

    tableBody.prepend(newRow);
}


/* ===============================
   VIEW TICKET MODAL
================================ */

function setupViewTicketModal(){

    const modal = document.getElementById("viewTicketModal");
    const closeBtn = document.querySelector(".close-view-modal");
    const completeBtn = document.getElementById("completeTicketBtn");

    let currentRow = null;

    document.addEventListener("click", function(e){

        const viewBtn = e.target.closest(".view-ticket");

        if(viewBtn){

            const row = viewBtn.closest("tr");
            currentRow = row;

            /* Use dataset instead of table cells */

            document.getElementById("view-ticket-number").textContent = row.dataset.ticketNumber;
            document.getElementById("view-title").textContent = row.dataset.title;
            document.getElementById("view-priority").textContent = row.dataset.priority;
            document.getElementById("view-status").textContent = row.dataset.status;
            document.getElementById("view-assigned").textContent = row.dataset.assigned;
            document.getElementById("view-department").textContent = row.dataset.department;
            document.getElementById("view-sla").textContent = row.dataset.sla || "-";
            document.getElementById("view-due").textContent = row.dataset.due;
            document.getElementById("view-estimated").textContent = row.dataset.estimated;
            document.getElementById("view-created").textContent = row.dataset.created;
            document.getElementById("view-description").textContent = row.dataset.description;

            modal.classList.add("active");
        }

    });

    closeBtn?.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    modal?.addEventListener("click", (e)=>{
        if(e.target === modal){
            modal.classList.remove("active");
        }
    });

    completeBtn?.addEventListener("click", () => {

        if(!currentRow) return;

        const statusCell = currentRow.children[3];

        statusCell.innerHTML = `<span class="badge status-completed">Completed</span>`;
        currentRow.dataset.status = "Completed";

        modal.classList.remove("active");

    });

}