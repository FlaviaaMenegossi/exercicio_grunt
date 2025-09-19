
class PeopleSorter {
    constructor() {
        this.people = [];
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
    }

    /**
     * Inicializa os elementos DOM
     */
    initializeElements() {
        this.elements = {
            personInput: document.getElementById('person-input'),
            addPersonBtn: document.getElementById('add-person'),
            peopleList: document.getElementById('people-list'),
            peopleCount: document.getElementById('people-count'),
            clearAllBtn: document.getElementById('clear-all'),
            drawPersonBtn: document.getElementById('draw-person'),
            drawTeamsBtn: document.getElementById('draw-teams'),
            teamsCount: document.getElementById('teams-count'),
            resultContainer: document.getElementById('result-container'),
            resultContent: document.getElementById('result-content'),
            newDrawBtn: document.getElementById('new-draw'),
            notification: document.getElementById('notification')
        };
    }

    /**
     * Vincula eventos aos elementos
     */
    bindEvents() {
        // Adicionar pessoa
        this.elements.addPersonBtn.addEventListener('click', () => this.addPerson());
        this.elements.personInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addPerson();
            }
        });

        // Limpar todas as pessoas
        this.elements.clearAllBtn.addEventListener('click', () => this.clearAllPeople());

        // Sortear uma pessoa
        this.elements.drawPersonBtn.addEventListener('click', () => this.drawSinglePerson());

        // Dividir em times
        this.elements.drawTeamsBtn.addEventListener('click', () => this.drawTeams());

        // Novo sorteio
        this.elements.newDrawBtn.addEventListener('click', () => this.hideResults());

        // Validação do input de número de times
        this.elements.teamsCount.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value < 2) e.target.value = 2;
            if (value > 10) e.target.value = 10;
        });

        // Auto-focus no input
        this.elements.personInput.focus();
    }

    /**
     * Adiciona uma pessoa à lista
     */
    addPerson() {
        const name = this.elements.personInput.value.trim();
        
        if (!name) {
            this.showNotification('Por favor, digite um nome!', 'warning');
            return;
        }

        if (name.length > 50) {
            this.showNotification('Nome muito longo! Máximo 50 caracteres.', 'error');
            return;
        }

        if (this.people.includes(name)) {
            this.showNotification('Esta pessoa já foi adicionada!', 'warning');
            return;
        }

        if (this.people.length >= 100) {
            this.showNotification('Limite máximo de 100 pessoas atingido!', 'error');
            return;
        }

        this.people.push(name);
        this.elements.personInput.value = '';
        this.elements.personInput.focus();
        
        this.updateUI();
        this.showNotification(`${name} foi adicionado(a) com sucesso!`, 'success');
    }

    /**
     * Remove uma pessoa da lista
     */
    removePerson(name) {
        const index = this.people.indexOf(name);
        if (index > -1) {
            this.people.splice(index, 1);
            this.updateUI();
            this.showNotification(`${name} foi removido(a) da lista!`, 'success');
        }
    }

    /**
     * Limpa todas as pessoas da lista
     */
    clearAllPeople() {
        if (this.people.length === 0) {
            this.showNotification('A lista já está vazia!', 'warning');
            return;
        }

        if (confirm('Tem certeza que deseja remover todas as pessoas da lista?')) {
            this.people = [];
            this.updateUI();
            this.hideResults();
            this.showNotification('Lista limpa com sucesso!', 'success');
        }
    }

    /**
     * Sorteia uma única pessoa
     */
    drawSinglePerson() {
        if (this.people.length === 0) {
            this.showNotification('Adicione pelo menos uma pessoa para sortear!', 'warning');
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.people.length);
        const winner = this.people[randomIndex];

        this.showSinglePersonResult(winner);
        this.showNotification('Sorteio realizado com sucesso!', 'success');
    }

    /**
     * Divide as pessoas em times
     */
    drawTeams() {
        const teamsCount = parseInt(this.elements.teamsCount.value);
        
        if (this.people.length === 0) {
            this.showNotification('Adicione pelo menos uma pessoa para dividir em times!', 'warning');
            return;
        }

        if (this.people.length < teamsCount) {
            this.showNotification(`Você precisa de pelo menos ${teamsCount} pessoas para formar ${teamsCount} times!`, 'warning');
            return;
        }

        const teams = this.divideIntoTeams(this.people, teamsCount);
        this.showTeamsResult(teams);
        this.showNotification('Times formados com sucesso!', 'success');
    }

    /**
     * Algoritmo para dividir pessoas em times de forma equilibrada
     */
    divideIntoTeams(people, teamsCount) {
        // Embaralha a lista de pessoas
        const shuffledPeople = [...people].sort(() => Math.random() - 0.5);
        
        // Cria os times vazios
        const teams = Array.from({ length: teamsCount }, (_, i) => ({
            name: `Time ${i + 1}`,
            members: []
        }));

        // Distribui as pessoas nos times de forma circular
        shuffledPeople.forEach((person, index) => {
            const teamIndex = index % teamsCount;
            teams[teamIndex].members.push(person);
        });

        return teams;
    }

    /**
     * Exibe o resultado do sorteio de uma pessoa
     */
    showSinglePersonResult(winner) {
        this.elements.resultContent.innerHTML = `
            <div class="winner">
                <i class="fas fa-crown"></i>
                ${this.escapeHtml(winner)}
            </div>
        `;
        
        this.showResults();
    }

    /**
     * Exibe o resultado da divisão em times
     */
    showTeamsResult(teams) {
        const teamsHtml = teams.map(team => `
            <div class="team">
                <div class="team-name">
                    <i class="fas fa-users"></i>
                    ${team.name} (${team.members.length} ${team.members.length === 1 ? 'pessoa' : 'pessoas'})
                </div>
                <ul class="team-members">
                    ${team.members.map(member => `<li>${this.escapeHtml(member)}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        this.elements.resultContent.innerHTML = `
            <div class="teams-result">
                ${teamsHtml}
            </div>
        `;
        
        this.showResults();
    }

    /**
     * Mostra a seção de resultados
     */
    showResults() {
        this.elements.resultContainer.classList.remove('hidden');
        this.elements.resultContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }

    /**
     * Esconde a seção de resultados
     */
    hideResults() {
        this.elements.resultContainer.classList.add('hidden');
    }

    /**
     * Atualiza a interface do usuário
     */
    updateUI() {
        this.updatePeopleList();
        this.updatePeopleCount();
        this.updateButtonStates();
    }

    /**
     * Atualiza a lista de pessoas na interface
     */
    updatePeopleList() {
        if (this.people.length === 0) {
            this.elements.peopleList.innerHTML = `
                <li class="person-item" style="justify-content: center; opacity: 0.6;">
                    <span>Nenhuma pessoa adicionada ainda</span>
                </li>
            `;
            return;
        }

        this.elements.peopleList.innerHTML = this.people.map(person => `
            <li class="person-item">
                <span class="person-name">${this.escapeHtml(person)}</span>
                <button class="remove-btn" onclick="sorter.removePerson('${this.escapeHtml(person)}')" title="Remover pessoa">
                    <i class="fas fa-times"></i>
                </button>
            </li>
        `).join('');
    }

    /**
     * Atualiza o contador de pessoas
     */
    updatePeopleCount() {
        this.elements.peopleCount.textContent = this.people.length;
    }

    /**
     * Atualiza o estado dos botões
     */
    updateButtonStates() {
        const hasPeople = this.people.length > 0;
        const teamsCount = parseInt(this.elements.teamsCount.value);
        const canFormTeams = this.people.length >= teamsCount;

        this.elements.drawPersonBtn.disabled = !hasPeople;
        this.elements.drawTeamsBtn.disabled = !canFormTeams;
        this.elements.clearAllBtn.disabled = !hasPeople;

        // Atualiza o texto do botão de times
        if (!canFormTeams && hasPeople) {
            this.elements.drawTeamsBtn.innerHTML = `
                <i class="fas fa-users"></i>
                <span>Precisa de ${teamsCount - this.people.length} pessoa(s)</span>
            `;
        } else {
            this.elements.drawTeamsBtn.innerHTML = `
                <i class="fas fa-users"></i>
                <span>Dividir em Times</span>
            `;
        }
    }

    /**
     * Exibe notificação para o usuário
     */
    showNotification(message, type = 'success') {
        this.elements.notification.textContent = message;
        this.elements.notification.className = `notification ${type}`;
        
        // Remove classes anteriores e adiciona 'show'
        setTimeout(() => {
            this.elements.notification.classList.add('show');
        }, 100);

        // Remove a notificação após 3 segundos
        setTimeout(() => {
            this.elements.notification.classList.remove('show');
        }, 3000);
    }

    /**
     * Escapa caracteres HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Salva dados no localStorage
     */
    saveToLocalStorage() {
        try {
            localStorage.setItem('sorteador-pessoas', JSON.stringify(this.people));
        } catch (error) {
            console.warn('Não foi possível salvar no localStorage:', error);
        }
    }

    /**
     * Carrega dados do localStorage
     */
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('sorteador-pessoas');
            if (saved) {
                this.people = JSON.parse(saved);
                this.updateUI();
            }
        } catch (error) {
            console.warn('Não foi possível carregar do localStorage:', error);
        }
    }

    /**
     * Exporta a lista de pessoas
     */
    exportPeople() {
        if (this.people.length === 0) {
            this.showNotification('Não há pessoas para exportar!', 'warning');
            return;
        }

        const dataStr = this.people.join('\n');
        const dataBlob = new Blob([dataStr], { type: 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'lista-pessoas.txt';
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Lista exportada com sucesso!', 'success');
    }

    /**
     * Importa lista de pessoas de um arquivo
     */
    importPeople(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const names = content.split('\n')
                    .map(name => name.trim())
                    .filter(name => name.length > 0)
                    .slice(0, 100); // Limite de 100 pessoas

                this.people = [...new Set([...this.people, ...names])]; // Remove duplicatas
                this.updateUI();
                this.showNotification(`${names.length} pessoa(s) importada(s) com sucesso!`, 'success');
            } catch (error) {
                this.showNotification('Erro ao importar arquivo!', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Inicialização da aplicação
let sorter;

document.addEventListener('DOMContentLoaded', () => {
    sorter = new PeopleSorter();
    
    // Carrega dados salvos
    sorter.loadFromLocalStorage();
    
    // Salva automaticamente quando a página é fechada
    window.addEventListener('beforeunload', () => {
        sorter.saveToLocalStorage();
    });
    
    // Salva periodicamente
    setInterval(() => {
        sorter.saveToLocalStorage();
    }, 30000); // A cada 30 segundos
});

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter para sortear pessoa
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (sorter.people.length > 0) {
            sorter.drawSinglePerson();
        }
    }
    
    // Escape para esconder resultados
    if (e.key === 'Escape') {
        sorter.hideResults();
    }
});

// Previne o envio do formulário se houver um
document.addEventListener('submit', (e) => {
    e.preventDefault();
});