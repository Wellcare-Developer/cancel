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

        // Generate letter content in a new format matching the provided image
        const letter = `
            <div class="cancellation-form" style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px;">
                <h1 style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 40px; text-transform: uppercase; color: #e74c3c; letter-spacing: 1px;">CANCELLATION REQUEST</h1>
                
                <div class="form-fields" style="margin-bottom: 30px;">
                    <div class="form-field" style="margin-bottom: 25px; text-align: left;">
                        <div class="field-label" style="font-weight: bold; color: #2c3e50; margin-bottom: 5px;">Insurance Company:</div>
                        <div class="field-value" style="border-bottom: 2px solid #3498db; display: inline-block; min-width: 350px; padding-bottom: 2px; text-align: left;">${insurer}</div>
                    </div>
                    
                    <div class="form-field" style="margin-bottom: 25px; text-align: left;">
                        <div class="field-label" style="font-weight: bold; color: #2c3e50; margin-bottom: 5px;">Insured:</div>
                        <div class="field-value" style="border-bottom: 2px solid #3498db; display: inline-block; min-width: 350px; padding-bottom: 2px; text-align: left;">${namedInsured}</div>
                    </div>
                    
                    <div class="form-field" style="margin-bottom: 25px; text-align: left;">
                        <div class="field-label" style="font-weight: bold; color: #2c3e50; margin-bottom: 5px;">Policy Number:</div>
                        <div class="field-value" style="border-bottom: 2px solid #3498db; display: inline-block; min-width: 350px; padding-bottom: 2px; text-align: left;">${policyNumber}</div>
                    </div>
                </div>
                
                <div style="text-align: left; margin-top: 40px; line-height: 1.8;">
                    <p>To Whom It May Concern,</p>
                    
                    <p style="margin-top: 20px;">Please be advised that the undersigned insured(s) would like to cancel the above captioned policy effective 
                    <span style="color: #e74c3c; font-weight: bold;">${formattedCancelDate}</span> 12:01 a.m. 
                    ${reasonText ? `The reason for cancellation is: <span style="font-weight: 500;">${reasonText}</span>.` : ''}</p>
                    
                    <p style="margin-top: 20px;">Please kindly return the unearned premium, if any, to the above address.</p>
                    
                    <p style="margin-top: 30px;">Thank you for your attention.</p>
                    
                    <p style="margin-top: 20px;">Regards,</p>
                </div>
                
                <div class="signature-section" style="margin-top: 20px;">
                    <div style="border: 1px solid #3498db; border-radius: 5px; padding: 15px; max-width: 320px; position: relative;">
                        <div style="position: absolute; top: -10px; left: 15px; background: white; padding: 0 10px; font-size: 12px; color: #7f8c8d;">Signed electronically by</div>
                        <div style="text-align: center; padding: 10px 0; font-family: 'Brush Script MT', 'Segoe Script', 'Bradley Hand', cursive; font-size: 28px; color: #2c3e50;">${signature}</div>
                        <div style="text-align: center; font-size: 12px; color: #7f8c8d;">on ${formattedDate}</div>
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
        
        // Add some random variation to make the signature look more natural
        const randomRotation = Math.floor(Math.random() * 5) - 2; // Random rotation between -2 and 2 degrees
        const randomSize = Math.floor(Math.random() * 6) + 24; // Random size between 24-29px
        
        // Create a cursive style signature with slight randomization
        const signatureHTML = `<span style="font-family: 'Brush Script MT', 'Segoe Script', 'Bradley Hand', cursive; 
                                     font-size: ${randomSize}px; 
                                     transform: rotate(${randomRotation}deg); 
                                     display: inline-block;
                                     color: #000080;
                                     text-shadow: 0.5px 0.5px 1px rgba(0,0,0,0.2);">${name}</span>`;
        
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
                    <title>Insurance Cancellation Request</title>
                    <style>
                        @media print {
                            @page {
                                margin: 0.5in;
                            }
                            body {
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                                color-adjust: exact !important;
                            }
                        }
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #000;
                            max-width: 8.5in;
                            margin: 0 auto;
                            padding: 0.5in;
                        }
                        h1 {
                            text-align: center;
                            font-size: 28px;
                            font-weight: bold;
                            margin-bottom: 40px;
                            text-transform: uppercase;
                            color: #e74c3c;
                            letter-spacing: 2px;
                            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                        }
                        .form-field {
                            margin-bottom: 25px;
                            text-align: left;
                        }
                        .field-label {
                            font-weight: bold;
                            color: #2c3e50;
                            margin-bottom: 5px;
                        }
                        .field-value {
                            border-bottom: 2px solid #3498db;
                            display: inline-block;
                            min-width: 350px;
                            padding-bottom: 2px;
                            text-align: left;
                        }
                        .signature-section {
                            margin-top: 20px;
                        }
                        .highlight-date {
                            color: #e74c3c;
                            font-weight: bold;
                        }
                        @font-face {
                            font-family: 'Cursive Font';
                            src: local('Brush Script MT'), 
                                 local('Segoe Script'), 
                                 local('Bradley Hand'), 
                                 local('Comic Sans MS');
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
        
        // Add a slight delay to ensure content is loaded before printing
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }
}); 