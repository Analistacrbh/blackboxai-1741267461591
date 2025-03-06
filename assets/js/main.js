// Sistema de Vendas - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize all popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('sidebar-collapsed');
            document.querySelector('.main-content').classList.toggle('main-content-expanded');
        });
    }

    // Apply input masks
    applyInputMasks();
});

// Input mask application
function applyInputMasks() {
    // Date masks
    document.querySelectorAll('.mask-date').forEach(function(element) {
        IMask(element, {
            mask: Date,
            pattern: 'd/`m/`Y',
            blocks: {
                d: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 31,
                    maxLength: 2
                },
                m: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12,
                    maxLength: 2
                },
                Y: {
                    mask: IMask.MaskedRange,
                    from: 1900,
                    to: 2999
                }
            }
        });
    });

    // Money masks
    document.querySelectorAll('.mask-money').forEach(function(element) {
        IMask(element, {
            mask: 'R$ num',
            blocks: {
                num: {
                    mask: Number,
                    thousandsSeparator: '.',
                    radix: ',',
                    scale: 2,
                    padFractionalZeros: true,
                    normalizeZeros: true
                }
            }
        });
    });

    // Phone masks
    document.querySelectorAll('.mask-phone').forEach(function(element) {
        IMask(element, {
            mask: '(00) 0000-0000'
        });
    });

    // Mobile phone masks
    document.querySelectorAll('.mask-celphone').forEach(function(element) {
        IMask(element, {
            mask: '(00) 00000-0000'
        });
    });

    // CPF mask
    document.querySelectorAll('.mask-cpf').forEach(function(element) {
        IMask(element, {
            mask: '000.000.000-00'
        });
    });

    // CNPJ mask
    document.querySelectorAll('.mask-cnpj').forEach(function(element) {
        IMask(element, {
            mask: '00.000.000/0000-00'
        });
    });

    // CEP mask
    document.querySelectorAll('.mask-cep').forEach(function(element) {
        IMask(element, {
            mask: '00000-000'
        });
    });
}

// Toast notification function
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Confirmation dialog function
function confirmAction(title, message, type = 'warning') {
    return Swal.fire({
        title: title,
        text: message,
        icon: type,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
    });
}

// Format currency function
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Format date function
function formatDate(date, includeTime = false) {
    if (!date) return '';
    
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return new Date(date).toLocaleDateString('pt-BR', options);
}

// CEP search function
async function searchCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length !== 8) return null;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) return null;
        
        return data;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
    }
}

// Form validation function
function validateForm(formElement) {
    const form = document.querySelector(formElement);
    if (!form) return false;

    form.classList.add('was-validated');
    return form.checkValidity();
}

// Clear form function
function clearForm(formElement) {
    const form = document.querySelector(formElement);
    if (!form) return;

    form.reset();
    form.classList.remove('was-validated');
    
    // Clear Select2 if present
    form.querySelectorAll('.select2').forEach(function(select) {
        $(select).val(null).trigger('change');
    });
}

// DataTable default configuration
if (typeof $.fn.dataTable !== 'undefined') {
    $.extend(true, $.fn.dataTable.defaults, {
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Portuguese-Brasil.json"
        },
        responsive: true,
        processing: true,
        serverSide: true,
        pageLength: 10
    });
}

// Select2 default configuration
if (typeof $.fn.select2 !== 'undefined') {
    $.fn.select2.defaults.set("theme", "bootstrap-5");
    $.fn.select2.defaults.set("language", "pt-BR");
}

// AJAX global setup
$.ajaxSetup({
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    error: function(xhr, status, error) {
        if (xhr.status === 401) {
            window.location.href = 'login.php';
        } else if (xhr.status === 403) {
            showToast('Você não tem permissão para realizar esta ação.', 'danger');
        } else {
            showToast('Ocorreu um erro ao processar sua requisição.', 'danger');
        }
    }
});
