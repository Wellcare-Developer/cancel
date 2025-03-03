document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const printBtn = document.getElementById('print-btn');
    const letterContent = document.getElementById('letter-content');
    const emptyState = document.getElementById('empty-state');
    const cancelReasonSelect = document.getElementById('cancel-reason');
    const otherReasonTextarea = document.getElementById('other-reason');
    const insurerSelect = document.getElementById('insurer-select');
    const insurerInput = document.getElementById('insurer');

    // Initialize date picker
    flatpickr("#cancel-date", {
        dateFormat: "Y-m-d",
        allowInput: true,
        altInput: true,
        altFormat: "F j, Y",
        disableMobile: true,
        position: 'auto',
        static: true,
        appendTo: document.body
    });

    // Show/hide other reason textarea
    cancelReasonSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            otherReasonTextarea.classList.remove('hidden');
        } else {
            otherReasonTextarea.classList.add('hidden');
        }
    });

    // Show/hide insurance company input field
    insurerSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            insurerInput.classList.remove('hidden');
            insurerInput.focus();
        } else {
            insurerInput.classList.add('hidden');
        }
    });

    generateBtn.addEventListener('click', generateLetter);
    copyBtn.addEventListener('click', copyLetter);
    printBtn.addEventListener('click', printLetter);

    function generateLetter() {
        // Get all input values
        const namedInsured = document.getElementById('named-insured').value.trim();
        let insurer = '';
        
        // Get insurance company name
        if (insurerSelect.value === 'other') {
            insurer = insurerInput.value.trim();
        } else if (insurerSelect.value) {
            // Get the text of the selected option
            insurer = insurerSelect.options[insurerSelect.selectedIndex].text;
        }
        
        const policyNumber = document.getElementById('policy-number').value.trim();
        const cancelDate = document.getElementById('cancel-date').value;
        const cancelReason = document.getElementById('cancel-reason').value;
        const otherReason = document.getElementById('other-reason').value.trim();

        // Validate required fields
        if (!namedInsured || !insurer || !policyNumber || !cancelDate || !cancelReason) {
            alert('Please fill in all required information');
            return;
        }

        // Format current date
        const formattedDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // 修复日期处理问题 - 使用UTC时间避免时区问题
        let formattedCancelDate;
        if (/^\d{4}-\d{2}-\d{2}$/.test(cancelDate)) {
            // 如果日期格式是YYYY-MM-DD (flatpickr的内部格式)
            const [year, month, day] = cancelDate.split('-').map(Number);
            // 创建日期时使用UTC时间，避免时区问题
            const date = new Date(Date.UTC(year, month - 1, day));
            formattedCancelDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                timeZone: 'UTC' // 关键是使用UTC时区
            });
        } else {
            // 如果不是预期格式，使用原始处理方式
            formattedCancelDate = new Date(cancelDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // Get cancellation reason text
        let reasonText = '';
        switch(cancelReason) {
            case 'sold':
                reasonText = 'Property has been sold';
                break;
            case 'replaced':
                reasonText = 'Changed to another insurance provider';
                break;
            case 'moved':
                reasonText = 'Relocated to a different area';
                break;
            case 'cost':
                reasonText = 'Premium is too high';
                break;
            case 'other':
                reasonText = otherReason;
                break;
        }

        // Generate electronic signature
        const signature = generateSignature(namedInsured);

        // Generate letter content in a simple form format
        const letter = `
            <div class="cancellation-form">
                <div class="form-logo">
                    <h2>CANCELLATION REQUEST FORM</h2>
                </div>
                
                <div class="form-fields">
                    <div class="form-field">
                        <span class="field-label">Request Cancellation Date:</span>
                        <span class="field-value">${formattedCancelDate} @12:01 AM</span>
                    </div>
                    
                    <div class="form-field">
                        <span class="field-label">Named Insured:</span>
                        <span class="field-value">${namedInsured}</span>
                    </div>
                    
                    <div class="form-field">
                        <span class="field-label">Insurer:</span>
                        <span class="field-value">${insurer}</span>
                    </div>
                    
                    <div class="form-field">
                        <span class="field-label">Policy Number:</span>
                        <span class="field-value">${policyNumber}</span>
                    </div>
                    
                    <div class="form-field">
                        <span class="field-label">Reason for Cancellation:</span>
                        <span class="field-value">${reasonText}</span>
                    </div>

                    <div class="form-field signature-field">
                        <div class="signature-container">
                            <div class="signature-column">
                                <div class="signature-note">Electronic Signature</div>
                                <div class="signature">${signature}</div>
                                <div class="signature-date">Date: ${formattedDate}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Display generated letter
        letterContent.querySelector('.letter-preview').innerHTML = letter;
        letterContent.classList.remove('hidden');
        emptyState.classList.add('hidden');
        copyBtn.classList.remove('hidden');
    }

    function generateSignature(name) {
        // Create a signature based on the name
        if (!name) return '';
        
        // All signatures use cursive style with random variations for a more natural look
        const randomRotation = Math.floor(Math.random() * 3) - 1; // Random rotation between -1 and 1 degrees
        const randomSize = Math.floor(Math.random() * 4) + 24; // Random size between 24-27px
        
        // Slightly adjust style based on name length
        let signatureHTML;
        
        if (name.length < 10) {
            // For shorter names, use larger font and more tilt
            signatureHTML = `<div class="signature-style handwritten" 
                style="font-size: ${randomSize + 2}px; transform: rotate(${randomRotation - 1}deg);">
                ${name}
            </div>`;
        } else {
            // For longer names, use standard cursive style
            signatureHTML = `<div class="signature-style handwritten" 
                style="font-size: ${randomSize}px; transform: rotate(${randomRotation}deg);">
                ${name}
            </div>`;
        }
        
        return signatureHTML;
    }

    function copyLetter() {
        const letterText = letterContent.querySelector('.letter-preview').innerText;
        navigator.clipboard.writeText(letterText).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy text. Please copy manually.');
        });
    }
    
    function printLetter() {
        const printContent = letterContent.querySelector('.letter-preview').innerHTML;
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Insurance Cancellation Form</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        .cancellation-form {
                            max-width: 800px;
                            margin: 0 auto;
                        }
                        .form-logo {
                            text-align: center;
                            margin-bottom: 40px;
                        }
                        .form-logo h2 {
                            color: #e74c3c;
                            font-size: 24px;
                            font-weight: bold;
                            letter-spacing: 1px;
                        }
                        .form-fields {
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        }
                        .form-field {
                            display: flex;
                            flex-direction: column;
                            font-size: 16px;
                            line-height: 1.5;
                        }
                        .field-label {
                            font-weight: bold;
                            color: #333;
                            margin-bottom: 5px;
                        }
                        .field-value {
                            border-bottom: 1px solid #ccc;
                            padding-bottom: 5px;
                            color: #555;
                        }
                        .signature-container {
                            margin-top: 40px;
                            padding: 20px 25px;
                            border-top: 1px dashed #ccc;
                            background-color: #f9f9f9;
                            border-radius: 5px;
                        }
                        .signature-column {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                        }
                        .signature-note {
                            font-size: 12px;
                            color: #777;
                            margin-bottom: 8px;
                            font-style: italic;
                        }
                        .signature {
                            margin-bottom: 15px;
                            min-height: 40px;
                            display: flex;
                            align-items: center;
                        }
                        .signature-date {
                            font-size: 14px;
                            color: #555;
                            align-self: flex-start;
                            font-style: italic;
                            margin-left: 10px;
                        }
                        .signature-style {
                            padding: 5px 0;
                            display: inline-block;
                        }
                        .handwritten {
                            font-family: 'Brush Script MT', 'Dancing Script', cursive;
                            font-size: 26px;
                            color: #000;
                            text-shadow: 1px 1px 1px rgba(0,0,0,0.15);
                            line-height: 1.2;
                            letter-spacing: 1px;
                            position: relative;
                            display: inline-block;
                            padding: 0 5px;
                        }
                        .handwritten::after {
                            content: '';
                            position: absolute;
                            bottom: -2px;
                            left: 0;
                            width: 100%;
                            height: 1px;
                            background: rgba(0,0,0,0.3);
                            transform: scaleX(0.95) rotate(-0.5deg);
                        }
                        .cursive {
                            font-family: 'Brush Script MT', cursive;
                            font-size: 24px;
                            color: #000;
                            transform: rotate(-2deg);
                            text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
                        }
                        .initials-underline {
                            font-family: 'Arial', sans-serif;
                            font-size: 20px;
                            font-weight: bold;
                            text-decoration: underline;
                            color: #000;
                            letter-spacing: 2px;
                        }
                        .full-name-flourish {
                            font-family: 'Times New Roman', serif;
                            font-size: 20px;
                            font-style: italic;
                            color: #000;
                            border-bottom: 1px solid #000;
                            padding-bottom: 3px;
                        }
                        @media print {
                            body {
                                padding: 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Print after a short delay to ensure content is loaded
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }
}); 