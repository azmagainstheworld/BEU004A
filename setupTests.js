import '@testing-library/jest-dom';
import jQuery from 'jquery';
import { TextEncoder, TextDecoder } from 'util';

// Mocking function yang diperlukan oleh DataTables/Plugins
const mockDataTableDestroy = jest.fn();
const mockDataTable = {
    destroy: mockDataTableDestroy,
    search: jest.fn().mockReturnValue(''),
    table: jest.fn(() => ({
        body: jest.fn(() => ({
            unhighlight: jest.fn(),
            highlight: jest.fn(),
        })),
    })),
    on: jest.fn(),
    off: jest.fn(),
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// SETUP GLOBAL JQUERY DENGAN STRUKTUR LENGKAP

// 1. Definisikan Global $ dan jQuery
global.$ = jQuery;
global.jQuery = jQuery;

// 2. Pastikan fungsi inti seperti extend tersedia
// (Ini yang dicari oleh jquery-highlight dan plugin lainnya)
if (!jQuery.extend) {
    jQuery.extend = jest.fn((defaults, options) => ({ ...defaults, ...options }));
}

// 3. Pastikan $.fn tersedia
if (!jQuery.fn) {
    jQuery.fn = {};
}

// 4. Tambahkan Mock DataTables ke jQuery.fn
jQuery.fn.DataTable = jest.fn((options) => {
    // Simulasi initComplete
    if (options && options.initComplete) {
        options.initComplete.call({api: () => ({ table: () => mockDataTable.table() }) });
    }
    return mockDataTable;
});
jQuery.fn.DataTable.isDataTable = jest.fn(() => false);
jQuery.fn.DataTable.defaults = {};

// 5. Mock selektor agar bisa menangani panggilan di komponen
const mockJQueryElement = {
    on: jest.fn(),
    off: jest.fn(),
    data: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(() => ({ 
        remove: jest.fn(),
        appendTo: jest.fn(),
        on: jest.fn(),
    })),
    addClass: jest.fn(() => ({
        on: jest.fn(),
        appendTo: jest.fn(),
        remove: jest.fn(),
    })),
};

// Re-mock global $ agar dapat menangani panggilan selektor
global.$ = jest.fn((selector) => {
    if (typeof selector === 'string' && selector.startsWith("#")) {
        return {
            ...mockJQueryElement,
            DataTable: jQuery.fn.DataTable,
        };
    }
    return {
        ...mockJQueryElement,
    };
});
global.jQuery = global.$;