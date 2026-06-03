
// Simple, dependency-free JS for Mikrotik hotspot
(function () {

    // ==========================================================================
    //  SMOOTH INTERACTIVE FORM FOCUS VISIBILITY ENGINE
    // ==========================================================================
    function initializeInputSlideView() {
        // Targets text, tel, and password fields across the template
        const targetInputs = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="password"]');
        
        targetInputs.forEach(input => {
            input.addEventListener('focus', function () {
                // Find parent component card context block
                const parentBlock = this.closest('.modal-card') || this.closest('.card') || this;
                
                // Performs hardware-accelerated centering slide animation behavior
                setTimeout(() => {
                    parentBlock.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                }, 120); // Thread delay lets virtual keyboards instantiate first
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeInputSlideView);
    } else {
        initializeInputSlideView();
    }


    // ==========================================================================
    //  ALERT SYSTEM A: showAlert
    // ==========================================================================
    const alertContainer = document.getElementById('alert-container');
    function createAlert(msg, type = 'info', duration = 4000) {
        // Safe check fallback redirection to B if target DOM engine structure is missing
        const activeContainer = alertContainer || document.getElementById('dashboard-alert-container');
        if (!activeContainer) {
            console.warn("No alert container found in DOM for showAlert.");
            return null;
        }

        const el = document.createElement('div');
        el.className = 'alert alert-' + (type === 'error' ? 'error' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info');
        el.innerText = msg;
        activeContainer.appendChild(el);

        requestAnimationFrame(() => el.classList.add('alert-show'));

        const t = setTimeout(() => hide(), duration);

        function hide() {
            el.classList.add('alert-hide');
            setTimeout(() => { try { el.remove(); } catch (e) { } }, 260);
            clearTimeout(t);
        }

        el.addEventListener('click', hide);
        return el;
    }

    window.showAlert = createAlert;


    // ==========================================================================
    //  ALERT SYSTEM B: showDashboardAlert
    // ==========================================================================
    window.showDashboardAlert = function(message, type = 'info') {
        const container = document.getElementById('dashboard-alert-container') || alertContainer;
        if (!container) {
            // Self-repairing fallback if neither layout node exists in current dynamic DOM view
            window.showAlert(message, type);
            return;
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-hide`;
        alertDiv.innerText = message;

        container.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.classList.remove('alert-hide');
            alertDiv.classList.add('alert-show');
        }, 10);

        setTimeout(() => {
            alertDiv.classList.remove('alert-show');
            alertDiv.classList.add('alert-hide');
            setTimeout(() => { alertDiv.remove(); }, 400);
        }, 4000);
    };


    // ==========================================================================
    //  TOKEN CONFIGURATION
    // ==========================================================================
    const API_TOKEN = "XTGfshj567";   // <-- Replace this later


    // ==========================================================================
    //  LOADING / WAITING FOR MPESA
    // ==========================================================================
    window.showMpesaWaitModal = function(timeoutSec = 30) {
        const modal = document.getElementById("mpesa-wait-modal");
        const countdown = document.getElementById("countdown-text");

        if (document.getElementById('main-container')) document.getElementById('main-container').classList.add('hidden');
        if (document.getElementById('payment-modal')) document.getElementById('payment-modal').classList.add('hidden');
        
        if (modal) {
            modal.classList.remove("hidden");
            let remaining = timeoutSec;
            if (countdown) countdown.innerText = `Timeout in ${remaining}s`;

            const interval = setInterval(() => {
                remaining--;
                if (countdown) countdown.innerText = `Timeout in ${remaining}s`;

                if (remaining <= 0) {
                    window.hideMpesaWaitModal();
                    window.showAlert("M-Pesa took too long. Please try again.", "error");
                    clearInterval(interval);
                }
            }, 1000);

            modal.dataset.timer = interval;
        }
    };

    window.hideMpesaWaitModal = function() {
        const modal = document.getElementById("mpesa-wait-modal");
        if (modal) {
            modal.classList.add("hidden");
            const timer = modal.dataset.timer;
            if (timer) clearInterval(timer);
        }
    };


    // ==========================================================================
    //  RETRY LOGIC (Backend Resiliency Engine)
    // ==========================================================================
    async function fetchWithRetry(url, options, retries = 3, backoff = 500) {
        try {
            return await fetch(url, options);
        } catch (err) {
            if (retries === 0) throw err;
            await new Promise(r => setTimeout(r, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
    }


    // ==========================================================================
    //  TELEPHONY DATA NORMALIZATION
    // ==========================================================================
    function normalizePhone(raw) {
        if (!raw) return '';
        let phone = raw.replace(/\D/g, '');
        if (phone.startsWith('0')) phone = '254' + phone.slice(1);
        else if (phone.startsWith('7')) phone = '254' + phone;
        else if (phone.startsWith('1')) phone = '254' + phone; // Keeps support active for newer 01xx lines
        else if (!phone.startsWith('254')) {
            phone = '254' + phone;
        }
        return phone;
    }

    function validPhone(p) {
        return /^254(7|1)\d{8}$/.test(p);
    }


    // ==========================================================================
    //  PAY FUNCTION (REUSABLE STK HANDLER)
    // ==========================================================================
    window.pay = async function(phone, selectedPackage, hotspot_data) {
        const payload = {
            phone,
            plan_id: selectedPackage.packageId || '',
            amount: selectedPackage.amount || 0,
            service_type:"HOTSPOT",
            hotspot_data: hotspot_data || {}
        };
        
        const btn = document.getElementById('pay-now-btn');
        let shouldCloseModal = false;

        try {
            if (btn) {
                btn.disabled = true;
                btn.innerText = 'Processing...';
            }

            window.showMpesaWaitModal(30);

            const res = await fetchWithRetry(
                "http://192.168.100.88:8000/mpesa/pay/",
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + API_TOKEN
                    },
                    body: JSON.stringify(payload)
                },
                3,
                800
            );

            let data = {};
            try { data = await res.json(); } catch (e) { }

            window.hideMpesaWaitModal();

            if (res.ok) {
                shouldCloseModal = true;
                window.showAlert(data.message || "Payment initiated", "success");

                if (data.tx_id) {
                    window.location.href = `http://192.168.100.88:8000/mpesa/transactions/auto_login/${data.tx_id}`;
                }
            } else {
                window.showAlert(data.error || "Payment failed", "error");
            }

        } catch (err) {
            window.hideMpesaWaitModal();
            window.showAlert("Backend offline: " + err.message, "error");
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerText = "Pay Now";
            }
            if (shouldCloseModal) {
                window.closeModal();
            }
        }
    };


    // ==========================================================================
    //  UI VISIBILITY CONTROLLERS
    // ==========================================================================
    window.toggleMore = function () {
        const target = document.getElementById('more-packages');
        if (target) target.classList.toggle('hidden');
    };

    let selectedPackage = {};

    window.openPayment = function (amount, details, packageId) {
        amount = parseFloat(amount).toFixed(2);
        selectedPackage = { amount, details, packageId };
        
        if(document.getElementById('payment-title')) {
            document.getElementById('payment-title').innerText = `Pay Ksh ${amount} — ${details}`;
        }
        if(document.getElementById('main-container')) document.getElementById('main-container').classList.add('hidden');
        if(document.getElementById('payment-modal')) document.getElementById('payment-modal').classList.remove('hidden');
        
        const phoneInput = document.getElementById('phone-input');
        if (phoneInput) setTimeout(() => phoneInput.focus(), 50);
    };

    window.closeModal = function () {
        if(document.getElementById('payment-modal')) document.getElementById('payment-modal').classList.add('hidden');
        if(document.getElementById('main-container')) document.getElementById('main-container').classList.remove('hidden');
        if(document.getElementById('phone-input')) document.getElementById('phone-input').value = '';
        selectedPackage = {};
    };
    
    window.getHotspotData = function() {
        return {
            mac: document.getElementById('hs-mac')?.value || "",
            ip: document.getElementById('hs-ip')?.value || "",
            user: document.getElementById('hs-user')?.value || "",
            identity: document.getElementById('hs-identity')?.value || "",
            sessionid: document.getElementById('hs-sessionid')?.value || "",
            link_login: document.getElementById('hs-link-login')?.value || "",
            link_orig: document.getElementById('hs-link-orig')?.value || "",
            link_logout: document.getElementById('hs-link-logout')?.value || "",
            chap_id: document.getElementById('hs-chap-id')?.value || "",
            chap_challenge: document.getElementById('hs-chap-challenge')?.value || ""
        };
    };


    // ==========================================================================
    //  SUBMIT PAYMENT WITH CONTEXT VALIDATION FIX
    // ==========================================================================
    window.submitPayment = async function () {
        const phoneField = document.getElementById('phone-input');
        const raw = phoneField ? phoneField.value.trim() : '';
        const hotspot_data = window.getHotspotData();

        if (!raw) {
            window.showDashboardAlert('Please enter your phone number.', 'warning');
            if (phoneField) phoneField.focus();
            return;
        }

        const phone = normalizePhone(raw);
        if (!validPhone(phone)) {
            window.showAlert('Invalid phone number. Use 254XXXXXXXXX formats', 'error');
            if (phoneField) phoneField.focus();
            return;
        }

        window.pay(phone, selectedPackage, hotspot_data);  
    };


    // ==========================================================================
    //  PASSWORD RECOVERY OPERATIONS PIPELINE
    // ==========================================================================
    window.openRequestModal = function() {
        if(document.getElementById('reconnect-modal')) document.getElementById('reconnect-modal').classList.add('hidden');
        if(document.getElementById('request-input-stage')) document.getElementById('request-input-stage').classList.remove('hidden');
        if(document.getElementById('request-result-stage')) document.getElementById('request-result-stage').classList.add('hidden');
        if(document.getElementById('request-phone')) document.getElementById('request-phone').value = '';
        if(document.getElementById('request-modal')) document.getElementById('request-modal').classList.remove('hidden');
    };

    window.closeRequestModal = function() {
        if(document.getElementById('request-modal')) document.getElementById('request-modal').classList.add('hidden');
    };

    window.submitPasswordRequest = function() {
        const phoneField = document.getElementById('request-phone');
        const phoneInput = phoneField ? phoneField.value.trim() : '';
        const submitBtn = document.getElementById('request-submit-btn');
        
        if(!phoneInput) {
            window.showDashboardAlert("Please enter a registered phone number.", "error");
            if (phoneField) phoneField.focus();
            return;
        }

        const phone = normalizePhone(phoneInput);
        if(!validPhone(phone)) {
            window.showDashboardAlert("Please enter a valid format number.", "error");
            if (phoneField) phoneField.focus();
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = "Fetching...";
        }

        fetch('http://192.168.100.88:8000/api/recover-password/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: phone })
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) throw new Error(data.message || "Server Error encountered.");
                return data;
            });
        })
        .then(data => {
            if(document.getElementById('displayed-password')) {
                document.getElementById('displayed-password').innerText = data.password;
            }
            if(document.getElementById('request-input-stage')) document.getElementById('request-input-stage').classList.add('hidden');
            if(document.getElementById('request-result-stage')) document.getElementById('request-result-stage').classList.remove('hidden');
        })
        .catch(error => {
            window.showDashboardAlert(error.message, "error");
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Submit";
            }
        });
    };

    window.copyRecoveredPassword = function() {
        const displayBox = document.getElementById('displayed-password');
        const passwordText = displayBox ? displayBox.innerText : '';
        if(!passwordText) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(passwordText)
                .then(() => {
                    window.showDashboardAlert("Password copied to clipboard!", "success");
                })
                .catch(err => {
                    fallbackCopyText(passwordText);
                });
        } else {
            fallbackCopyText(passwordText);
        }
    };

    function fallbackCopyText(text) {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, 99999);

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                window.showDashboardAlert("Password copied via fallback!", "success");
            } else {
                window.showDashboardAlert("Unable to copy automatically. Please copy text manually.", "warning");
            }
        } catch (err) {
            window.showDashboardAlert("Copy action failed. Please long-press to copy.", "error");
        }
    }

    window.backToReconnect = function() {
        if(document.getElementById('request-modal')) document.getElementById('request-modal').classList.add('hidden');
        if(document.getElementById('reconnect-modal')) document.getElementById('reconnect-modal').classList.remove('hidden');
        
        const reqPhoneVal = document.getElementById('request-phone')?.value || '';
        if(document.getElementById('reconnect-phone')) {
            document.getElementById('reconnect-phone').value = reqPhoneVal;
        }
        const reconPass = document.getElementById('reconnect-password');
        if (reconPass) setTimeout(() => reconPass.focus(), 50);
    };


    // ==========================================================================
    //  RECONNECT ACCESS SUBSYSTEM WITH ALERT REPAIR FIX
    // ==========================================================================
    window.openReconnect = function () {
        if(document.getElementById('main-container')) document.getElementById('main-container').classList.add('hidden');
        if(document.getElementById('reconnect-modal')) document.getElementById('reconnect-modal').classList.remove('hidden');
        
        const reconPhone = document.getElementById('reconnect-phone');
        if (reconPhone) setTimeout(() => reconPhone.focus(), 50);
    };

    window.closeReconnect = function () {
        if(document.getElementById('reconnect-modal')) document.getElementById('reconnect-modal').classList.add('hidden');
        if(document.getElementById('main-container')) document.getElementById('main-container').classList.remove('hidden');
        
        if(document.getElementById('reconnect-phone')) document.getElementById('reconnect-phone').value = '';
        if(document.getElementById('reconnect-password')) document.getElementById('reconnect-password').value = '';
        if(document.getElementById('hs-mac')) document.getElementById('hs-mac').value = '';
        if(document.getElementById('hs-ip')) document.getElementById('hs-ip').value = '';
        if(document.getElementById('hs-link-login')) document.getElementById('hs-link-login').value = '';
    };

    window.submitReconnect = async function () {
        const reconPhoneField = document.getElementById('reconnect-phone');
        const reconPassField = document.getElementById('reconnect-password');
        
        const raw = reconPhoneField ? reconPhoneField.value.trim() : "";
        const pass = reconPassField ? reconPassField.value : "";
        const mac = document.getElementById('hs-mac')?.value || "";
        const ip = document.getElementById('hs-ip')?.value || "";    
        const dst = document.getElementById('hs-link-login')?.value || "";
        const mikrotik_identity_name = document.getElementById('hs-identity')?.value || "";

        if (!raw || !pass) {
            window.showAlert('Please enter both phone and password', 'warning');
            return;
        }

        const phone = normalizePhone(raw);
        if (!validPhone(phone)) {
            window.showAlert('Invalid phone number. Use 254XXXXXXXXX formats', 'error');
            if (reconPhoneField) reconPhoneField.focus();
            return;
        }

        const payload = { phone, password: pass, mac, ip, dst, mikrotik_identity_name };
        const btn = document.getElementById('reconnect-btn');
        let shouldCloseReconnect = false;

        try {
            if (btn) {
                btn.disabled = true;
                btn.innerText = 'Reconnecting...';
            }

            const response = await fetch(`http://192.168.100.88:8000/mpesa/transactions/reconnect/${phone}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const html = await response.text();

            if (!response.ok) {
                let errorObjMsg = "Authentication system rejected parameters.";
                try {
                    const parsed = JSON.parse(html);
                    if (parsed.message || parsed.error) errorObjMsg = parsed.message || parsed.error;
                } catch(e) {}
                throw new Error(errorObjMsg);
            }

            shouldCloseReconnect = true;
            const win = window.open("", "_self");
            if (win) {
                win.document.write(html);
                win.document.close();
            }
        } catch (err) {
            window.showAlert("Network error: " + err.message, "error");
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerText = "Reconnect";
            }
            if (shouldCloseReconnect) {
                window.closeReconnect();
            }
        }
    };

})();
