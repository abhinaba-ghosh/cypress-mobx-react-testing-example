/* eslint-disable no-undef */
/* eslint-disable jest/valid-expect-in-promise */
/// <reference types="cypress" />

import { mount } from '@cypress/react';
import React from 'react';
import ToDoForm from '../components/ToDoForm';
import ToDoList from '../components/ToDoList';
import ToDoListCounter from '../components/ToDoListCounter';
import StoreProvider from '../store/ToDoStore';

describe('MobX store tests', () => {
    beforeEach(() => {
        mount(
            <StoreProvider>
                <main>
                    <ToDoForm />
                    <ToDoList />
                    <ToDoListCounter />
                </main>
            </StoreProvider>
        );
    });

    it('should add item to mobx store', () => {
        cy.window().its('store').invoke('addItem', 'Buy milk');
        cy.get('ul').children().should('contains.text', 'Buy milk');
    });

    it('should inject items to mobx store manipulating items array', () => {
        cy.window()
            .its('store.items')
            .as('items')
            .get('@items')
            .then((item) => item.push('Buy milk'));
        cy.get('ul').children().should('contains.text', 'Buy milk');
    });

    it('should delete an item from mobx store', () => {
        cy.window().its('store').invoke('addItem', 'Buy milk');
        cy.get('ul').children().should('contains.text', 'Buy milk');

        cy.window().its('store').invoke('deleteItem', 'Buy milk');
        cy.get('h1').should('contains.text', 'No Tasks in hand');
    });

    it('should get real-time items count from mobx store', () => {
        cy.window().its('store').invoke('addItem', 'Buy milk');
        cy.window().its('store').invoke('addItem', 'Go shopping');

        cy.window().its('store').its('itemsCount').should('eq', 2);
    });
});
