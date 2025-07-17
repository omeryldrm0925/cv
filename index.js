/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { render } from 'preact';
import { html } from 'htm/preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';

const initialCVData = {
    name: 'Ömer Yıldırım',
    title: 'Frontend Developer & UI/UX Enthusiast',
    summary: 'Seeking to leverage my experience in agile environments and passion for creating seamless user experiences in a dynamic frontend development role.',
    photo: 'https://i.imgur.com/ZslTKNB.jpeg',
    contactInfo: [
        { id: 1, type: 'email', value: 'omeryldrm0925@gmail.com', icon: 'fa-solid fa-envelope' },
        { id: 2, type: 'phone', value: '+90 505 095 7822', icon: 'fa-solid fa-phone' },
        { id: 3, type: 'linkedin', value: 'https://www.linkedin.com/in/ömer-yıldırım-4b7067192', icon: 'fa-brands fa-linkedin' }
    ],
    experience: [
        { id: 1, title: 'Assistant Specialist', company: 'Türkiye İş Bankası', startDate: '2025-04-01', endDate: '', ongoing: true, description: ['Worked in agile team using Jira for task tracking.', 'Assisted in PO processes for the BCH banking product.', 'Coordinated with develop team during sprints.', 'Provided real-time support to the branches.'] },
        { id: 2, title: 'Global E-Commerce Specialist', company: 'Nocturne', startDate: '2024-11-01', endDate: '2025-03-01', ongoing: false, description: ['Managed US and UAE marketplace operations.', 'Designed apps through Python to fasten daily processes.', 'Tracked tasks via Monday.com.', 'Supported Google & Meta ads with agency.', 'Handled end-to-end product publish process.'] },
    ],
    volunteerExperience: [
        { id: 1, title: 'Exchange Student', company: 'Work and Travel', startDate: '2023-06-01', endDate: '2023-09-01', ongoing: false, description: ['Improving my English speaking skills to perfection.', 'Working on different sectors for hours to get disciplined.', 'Time and money management.'] },
        { id: 2, title: 'Founder & President', company: 'Bilgi Career Club', startDate: '2022-10-01', endDate: '2024-06-01', ongoing: false, description: ['Project and team management experiences as a founder president.', 'Getting contact with great leaders from varied companies.', 'Improving my presentation and communication skills.'] },
    ],
    skills: [
        { id: 1, name: 'MS Office', level: 5, icon: 'fa-solid fa-file-word' },
        { id: 2, name: 'ERP Systems', level: 4, icon: 'fa-solid fa-sitemap' },
        { id: 3, name: 'YouTrack', level: 4, icon: 'fa-solid fa-bug' },
        { id: 4, name: 'Monday.com', level: 5, icon: 'fa-solid fa-calendar-days' },
        { id: 5, name: 'Product Management', level: 3, icon: 'fa-solid fa-box-archive' },
        { id: 6, name: 'Shopify', level: 4, icon: 'fa-brands fa-shopify' },
        { id: 7, name: 'Canva', level: 5, icon: 'fa-solid fa-palette' },
        { id: 8, name: 'Jira', level: 4, icon: 'fa-brands fa-jira' },
        { id: 9, name: 'CRM', level: 3, icon: 'fa-solid fa-users-gear' },
        { id: 10, name: 'Notion', level: 5, icon: 'fa-solid fa-book-open' },
        { id: 11, name: 'Ad Management', level: 3, icon: 'fa-solid fa-bullhorn' },
        { id: 12, name: 'Python', level: 2, icon: 'fa-brands fa-python' },
    ],
    education: [
        { id: 1, degree: 'International Relations (%100 Scholarship)', school: 'Bilgi University', startDate: '2019-09-01', endDate: '2024-06-01', ongoing: false, description:[] },
        { id: 2, degree: 'High School', school: 'İbrahim Hakkı Fen Lisesi', startDate: '2015-09-01', endDate: '2019-06-01', ongoing: false, description:[] }
    ],
    interests: [
        { id: 1, name: 'Games', icon: 'fa-solid fa-gamepad' },
        { id: 2, name: 'Football', icon: 'fa-solid fa-futbol' },
        { id: 3, name: 'Cinema', icon: 'fa-solid fa-film' },
        { id: 4, name: 'Fitness', icon: 'fa-solid fa-dumbbell' },
        { id: 5, name: 'Swimming', icon: 'fa-solid fa-person-swimming' },
        { id: 6, name: 'Photography', icon: 'fa-solid fa-camera-retro' },
        { id: 7, name: 'Camping', icon: 'fa-solid fa-campground' },
        { id: 8, name: 'Keeping a Diary', icon: 'fa-solid fa-book' },
    ],
    languages: [
        { id: 1, name: 'Turkish', level: 'Native' },
        { id: 2, name: 'English', level: 'Fluent' }
    ],
    references: [
        { id: 1, name: 'Burak Akbulat', title: 'Sales Manager of Nocturne', phone: '0549 576 54 44', email: 'burak.akbulat@example.com' },
        { id: 2, name: 'Onur Ahmet', title: 'CEO of Profeed', phone: '0533 668 93 15', email: 'onur.ahmet@example.com' },
    ]
};

const themes = [
    { id: 'default', name: 'Mor', gradient: 'linear-gradient(90deg, #8A2BE2 0%, #4169E1 50%, #00BFFF 100%)' },
    { id: 'orange', name: 'Turuncu', gradient: 'linear-gradient(90deg, #FF8C00 0%, #FFA500 50%, #FFD700 100%)' },
    { id: 'beige', name: 'Bej', gradient: 'linear-gradient(90deg, #D2B48C 0%, #F5DEB3 50%, #FFF8DC 100%)' },
    { id: 'pink', name: 'Pembe', gradient: 'linear-gradient(90deg, #FF69B4 0%, #FFC0CB 50%, #FFE4E1 100%)' },
    { id: 'dark', name: 'Siyah' },
    { id: 'light', name: 'Beyaz' },
];

const faIcons = [ 'fa-solid fa-star', 'fa-solid fa-award', 'fa-solid fa-anchor', 'fa-solid fa-rocket', 'fa-solid fa-code', 'fa-solid fa-database', 'fa-solid fa-server', 'fa-solid fa-cloud', 'fa-solid fa-mobile-screen', 'fa-solid fa-palette', 'fa-solid fa-pen-ruler', 'fa-solid fa-users', 'fa-solid fa-comments', 'fa-solid fa-chart-line', 'fa-solid fa-chart-pie', 'fa-solid fa-bullseye', 'fa-solid fa-lightbulb', 'fa-solid fa-gears', 'fa-solid fa-briefcase', 'fa-solid fa-graduation-cap', 'fa-solid fa-book', 'fa-solid fa-gamepad', 'fa-solid fa-futbol', 'fa-solid fa-film', 'fa-solid fa-dumbbell', 'fa-solid fa-person-swimming', 'fa-solid fa-camera-retro', 'fa-solid fa-campground', 'fa-brands fa-react', 'fa-brands fa-js', 'fa-brands fa-html5', 'fa-brands fa-css3-alt', 'fa-brands fa-python', 'fa-brands fa-java', 'fa-brands fa-git-alt', 'fa-brands fa-docker', 'fa-brands fa-figma' ];
const languageLevels = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Fluent', 'Native'];

const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' }) : '';
const renderDates = (item) => {
    const start = formatDate(item.startDate);
    const end = item.ongoing ? 'Ongoing' : formatDate(item.endDate);
    if (!start && !end) return '';
    return `${start} - ${end}`;
}

const LandingPage = ({ cvData, onDataChange, isEditing, onToggleEdit }) => {
    const handleInput = (e) => {
        onDataChange({ ...cvData, [e.target.name]: e.target.value });
    };

    return html`
      <section class="landing-page">
        <div class="landing-content">
          <div class="local-edit-toggle-wrapper">
            <img src=${cvData.photo} alt="Profil Fotoğrafı" class="profile-photo" />
          </div>
          <div class="landing-text-content">
            <div class="name-container">
              ${isEditing ? html`
                <input type="text" name="name" class="editable-field" value=${cvData.name} onInput=${handleInput} />
              ` : html`
                <h1>${cvData.name}</h1>
              `}
               <button class="local-edit-toggle ${isEditing ? 'active' : ''}" onClick=${onToggleEdit} aria-label="Düzenle">
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </div>
             ${isEditing ? html`
                <input type="text" name="title" class="editable-field small" value=${cvData.title} onInput=${handleInput} placeholder="Unvanınız" />
                <textarea name="summary" class="editable-field small" onInput=${handleInput} placeholder="Kısa özetiniz...">${cvData.summary}</textarea>
             ` : html`
                <h2>${cvData.title}</h2>
                <p class="summary">${cvData.summary}</p>
             `}
          </div>
        </div>
      </section>
    `;
};

const MainMenu = ({ onSectionClick }) => {
    const menuItems = [
        { id: 'experience', label: 'Work Experiences', icon: 'fa-solid fa-briefcase' },
        { id: 'volunteerExperience', label: 'Volunteer Experiences', icon: 'fa-solid fa-hands-helping' },
        { id: 'education', label: 'Education', icon: 'fa-solid fa-graduation-cap' },
        { id: 'skills', label: 'Skills', icon: 'fa-solid fa-gears' },
        { id: 'interests', label: 'Interests', icon: 'fa-solid fa-heart' },
        { id: 'languages', label: 'Languages', icon: 'fa-solid fa-language' },
        { id: 'references', label: 'References', icon: 'fa-solid fa-users' },
        { id: 'contactInfo', label: 'Contact', icon: 'fa-solid fa-envelope' }
    ];

    return html`
      <section class="main-menu">
        <div class="menu-grid">
          ${menuItems.map(item => html`
            <button class="menu-item" onClick=${() => onSectionClick(item.id)}>
              <i class="${item.icon}"></i>
              <span>${item.label}</span>
            </button>
          `)}
        </div>
      </section>
    `;
};

const AddOrEditItemModal = ({ sectionId, item, onSave, onClose }) => {
    const isNew = !item || !item.id;
    const [formData, setFormData] = useState(isNew ? { description: [] } : { ...item });
    const [descType, setDescType] = useState(isNew || Array.isArray(item?.description) ? 'list' : 'paragraph');
    const [newListItemText, setNewListItemText] = useState('');

    const dragItem = useRef(null);
    const dragOverItem = useRef(null);
    
    useEffect(() => {
        // Ensure description is always an array for the form
        if (typeof formData.description === 'string') {
            setFormData(prev => ({ ...prev, description: [prev.description]}));
        }
    }, []);

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleStarRating = (level) => setFormData(prev => ({ ...prev, level }));
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(sectionId, formData);
        onClose();
    };
    
    const handleAddListItem = () => {
        if (newListItemText.trim() === '') return;
        setFormData(prev => ({ ...prev, description: [...(prev.description || []), newListItemText] }));
        setNewListItemText('');
    };

    const handleListItemKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddListItem();
        }
    };

    const handleDeleteListItem = (indexToDelete) => {
        setFormData(prev => ({ ...prev, description: prev.description.filter((_, index) => index !== indexToDelete) }));
    };

    const handleDragStart = (e, position) => {
        dragItem.current = position;
        e.currentTarget.classList.add('dragging');
    };

    const handleDragEnter = (e, position) => {
        dragOverItem.current = position;
    };

    const handleDrop = (e) => {
        e.currentTarget.classList.remove('dragging');
        const newList = [...formData.description];
        const dragItemContent = newList[dragItem.current];
        newList.splice(dragItem.current, 1);
        newList.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setFormData(prev => ({ ...prev, description: newList }));
    };


    const renderFormFields = () => {
        switch (sectionId) {
            case 'experience':
            case 'volunteerExperience':
            case 'education':
                const titleLabel = sectionId === 'education' ? 'Degree/Program' : 'Title';
                const companyLabel = sectionId === 'education' ? 'School/University' : 'Company';
                return html`
                    <div class="form-group"><label>${titleLabel}</label><input type="text" name=${sectionId === 'education' ? 'degree' : 'title'} value=${formData.degree || formData.title || ''} onInput=${handleInput} /></div>
                    <div class="form-group"><label>${companyLabel}</label><input type="text" name=${sectionId === 'education' ? 'school' : 'company'} value=${formData.school || formData.company || ''} onInput=${handleInput} /></div>
                    <div class="form-group date-group">
                        <label>Date Range</label>
                        <input type="date" name="startDate" value=${formData.startDate || ''} onInput=${handleInput} />
                        <input type="date" name="endDate" value=${formData.endDate || ''} onInput=${handleInput} disabled=${formData.ongoing} />
                        <label class="checkbox-label"><input type="checkbox" name="ongoing" checked=${formData.ongoing || false} onChange=${handleInput}/> Ongoing</label>
                    </div>
                     <div class="form-group">
                        <label>Description</label>
                        <div class="description-toggle">
                            <button type="button" class=${descType === 'list' ? 'active' : ''} onClick=${() => setDescType('list')}>List</button>
                            <button type="button" class=${descType === 'paragraph' ? 'active' : ''} onClick=${() => setDescType('paragraph')}>Paragraph</button>
                        </div>
                        ${descType === 'list' ? html`
                            <div class="description-list-editor">
                                <div class="list-input-group">
                                    <input type="text" placeholder="Describe your experiences in bullet points!" value=${newListItemText} onInput=${e => setNewListItemText(e.target.value)} onKeyDown=${handleListItemKeyDown}/>
                                    <button type="button" class="btn-add-item" onClick=${handleAddListItem}>Add</button>
                                </div>
                                <ul class="draggable-list">
                                    ${(formData.description || []).map((listItem, index) => html`
                                        <li 
                                            key=${index} 
                                            class="draggable-item"
                                            draggable="true"
                                            onDragStart=${e => handleDragStart(e, index)}
                                            onDragEnter=${e => handleDragEnter(e, index)}
                                            onDragEnd=${handleDrop}
                                            onDragOver=${e => e.preventDefault()}
                                        >
                                            <i class="fa-solid fa-grip-vertical drag-handle"></i>
                                            <span>${listItem}</span>
                                            <button type="button" class="delete-list-item" onClick=${() => handleDeleteListItem(index)} aria-label="Delete item"><i class="fa-solid fa-xmark"></i></button>
                                        </li>
                                    `)}
                                </ul>
                            </div>
                        ` : html`
                            <textarea 
                                name="description" 
                                value=${(Array.isArray(formData.description) ? formData.description.join('\\n') : formData.description) || ''} 
                                onInput=${e => setFormData(prev => ({...prev, description: [e.target.value]}))} 
                                placeholder="Enter a single paragraph.">
                            </textarea>
                        `}
                    </div>
                `;
            case 'skills':
                return html`
                    <div class="form-group"><label>Skill Name</label><input type="text" name="name" value=${formData.name || ''} onInput=${handleInput} /></div>
                    <div class="form-group"><label>Icon</label><${IconPicker} selected=${formData.icon} onChange=${(icon) => handleInput({ target: { name: 'icon', value: icon } })} /></div>
                    <div class="form-group"><label>Level</label><${StarRating} level=${formData.level || 0} onRate=${handleStarRating} isInteractive=${true} /></div>
                `;
            case 'interests':
                 return html`
                    <div class="form-group"><label>Interest Name</label><input type="text" name="name" value=${formData.name || ''} onInput=${handleInput} /></div>
                    <div class="form-group"><label>Icon</label><${IconPicker} selected=${formData.icon} onChange=${(icon) => handleInput({ target: { name: 'icon', value: icon } })} /></div>
                `;
            case 'languages':
                return html`
                    <div class="form-group"><label>Language</label><input type="text" name="name" value=${formData.name || ''} onInput=${handleInput} /></div>
                    <div class="form-group"><label>Level</label><select name="level" value=${formData.level || 'Beginner'} onInput=${handleInput}>${languageLevels.map(l => html`<option value=${l}>${l}</option>`)}</select></div>
                `;
            case 'references':
                return html`
                    <div class="form-group"><label>Name</label><input type="text" name="name" value=${formData.name || ''} onInput=${handleInput} /></div>
                    <div class="form-group"><label>Title</label><input type="text" name="title" value=${formData.title || ''} onInput=${handleInput} /></div>
                    <div class="form-group"><label>Email</label><input type="email" name="email" value=${formData.email || ''} onInput=${handleInput} /></div>
                    <div class="form-group"><label>Phone</label><input type="tel" name="phone" value=${formData.phone || ''} onInput=${handleInput} /></div>
                `;
            case 'contactInfo':
                return html`
                    <div class="form-group"><label>Type (e.g., Email, LinkedIn)</label><input type="text" name="type" value=${formData.type || ''} onInput=${handleInput} /></div>
                    <div class="form-group"><label>Value (e.g., your@email.com)</label><input type="text" name="value" value=${formData.value || ''} onInput=${handleInput} /></div>
                    <div class="form-group"><label>Icon</label><${IconPicker} selected=${formData.icon} onChange=${(icon) => handleInput({ target: { name: 'icon', value: icon } })} /></div>
                `;
            default: return null;
        }
    };

    return html`
        <div class="modal-overlay" onClick=${onClose}>
            <div class="modal-content form-modal" onClick=${e => e.stopPropagation()}>
                <button class="modal-close" onClick=${onClose} aria-label="Kapat"><i class="fa-solid fa-xmark"></i></button>
                <h2>${isNew ? 'Add New Item' : 'Edit Item'}</h2>
                <form class="modal-body" onSubmit=${handleSubmit}>
                    ${renderFormFields()}
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onClick=${onClose}>Cancel</button>
                        <button type="submit" class="btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    `;
};

const IconPicker = ({ selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useCallback(node => {
        if (node) {
            const handleClickOutside = (event) => {
                if (node && !node.contains(event.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const handleSelect = (iconClass) => {
        onChange(iconClass);
        setIsOpen(false);
    };

    const formatIconName = (iconClass) => iconClass.replace(/fa-(solid|brands) fa-/, '').replace(/-/g, ' ');

    return html`
        <div class="icon-picker" ref=${pickerRef}>
            <button type="button" class="icon-picker-button" onClick=${() => setIsOpen(!isOpen)} aria-expanded=${isOpen}>
                <span class="icon-picker-selected-value">
                    ${selected ? html`<i class="${selected}"></i> <span>${formatIconName(selected)}</span>` : 'Select an icon...'}
                </span>
                <i class="fa-solid fa-chevron-down"></i>
            </button>
            ${isOpen && html`
                <div class="icon-picker-panel">
                    ${faIcons.map(iconClass => html`
                        <button type="button" class="icon-picker-option" onClick=${() => handleSelect(iconClass)} title=${formatIconName(iconClass)}>
                            <i class="${iconClass}"></i>
                        </button>
                    `)}
                </div>
            `}
        </div>
    `;
};

const StarRating = ({ level, onRate, isInteractive }) => {
    return html`
        <div class="star-rating ${isInteractive ? 'interactive' : ''}">
            ${[1, 2, 3, 4, 5].map(star => html`
                <i 
                    class="${star <= level ? 'fa-solid' : 'fa-regular'} fa-star" 
                    onClick=${isInteractive && onRate ? () => onRate(star) : undefined}
                ></i>
            `)}
        </div>
    `;
};


const SectionModal = ({ section, data, onClose, onAddItem, onEditItem, onDeleteItem }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const handleEsc = (event) => {
           if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => { setCurrentIndex(0); }, [section]);

    if (!section) return null;

    let content;
    const sliderSections = ['experience', 'volunteerExperience', 'education'];
    const listSections = ['skills', 'interests', 'languages', 'references', 'contactInfo'];
    const items = data[section.id] || [];

    const renderItemControls = (item) => html`
        <div class="item-controls">
            <button onClick=${() => onEditItem(section.id, item)} aria-label="Edit item"><i class="fa-solid fa-pen"></i></button>
            <button onClick=${() => onDeleteItem(section.id, item.id)} aria-label="Delete item"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    
    if (sliderSections.includes(section.id)) {
        const currentItem = items[currentIndex];
        const next = () => setCurrentIndex(prev => (prev + 1) % items.length);
        const prev = () => setCurrentIndex(prev => (prev - 1 + items.length) % items.length);

        content = !currentItem ? html`<p class="empty-state">No items to display.</p>` : html`
            <div class="slider-container">
                <div class="item-controls-slider">${renderItemControls(currentItem)}</div>
                <div class="slider-card">
                    ${section.id === 'education' ? html`
                        <h3>${currentItem.school}</h3>
                        <h4>${currentItem.degree}</h4>
                        <p class="item-dates">${renderDates(currentItem)}</p>
                     ` : html`
                        <h3>${currentItem.company}</h3>
                        <h4>${currentItem.title}</h4>
                        <p class="item-dates">${renderDates(currentItem)}</p>
                        ${Array.isArray(currentItem.description) && currentItem.description.length > 0 && html`
                          <ul>${currentItem.description.map(d => html`<li>${d}</li>`)}</ul>
                        `}
                    `}
                </div>
                ${items.length > 1 && html`
                    <div class="slider-nav">
                        <button class="slider-nav-btn" onClick=${prev} aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
                        <span class="slider-counter">${currentIndex + 1} / ${items.length}</span>
                        <button class="slider-nav-btn" onClick=${next} aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                `}
            </div>
        `;
    } else if (listSections.includes(section.id)) {
        content = html`
            <ul class="icon-list ${section.id === 'references' || section.id === 'contactInfo' ? 'detailed-list' : ''}">
                ${items.length === 0 && html`<p class="empty-state">No items to display.</p>`}
                ${items.map(item => html`
                    <li class="icon-list-item">
                        <i class="${item.icon || 'fa-solid fa-star'}"></i>
                        <div class="item-content">
                            ${section.id === 'skills' ? html`<span>${item.name}</span> <${StarRating} level=${item.level} />` : ''}
                            ${section.id === 'interests' ? html`<span>${item.name}</span>` : ''}
                            ${section.id === 'languages' ? html`<span><strong>${item.name}:</strong> ${item.level}</span>` : ''}
                            ${section.id === 'references' ? html`
                                <div>
                                    <h3>${item.name}</h3>
                                    <h4>${item.title}</h4>
                                    <p><a href="mailto:${item.email}">${item.email}</a></p>
                                    <p><a href="tel:${item.phone?.replace(/ /g, '')}">${item.phone}</a></p>
                                </div>
                            ` : ''}
                            ${section.id === 'contactInfo' ? html`
                                <span>${item.type}</span>
                                <span><a href=${(item.type === 'email' ? 'mailto:' : (item.type === 'phone' ? 'tel:' : '')) + item.value} target="_blank" rel="noopener noreferrer">${item.value}</a></span>
                            ` : ''}
                        </div>
                        ${renderItemControls(item)}
                    </li>
                `)}
            </ul>
        `;
    }

    return html`
        <div class="modal-overlay" onClick=${onClose}>
            <div class="modal-content" onClick=${e => e.stopPropagation()}>
                 <div class="modal-header">
                    <h2>${section.label}</h2>
                    <button class="add-item-btn" onClick=${() => onAddItem(section.id)}><i class="fa-solid fa-plus"></i> Add New</button>
                 </div>
                 <button class="modal-close" onClick=${onClose} aria-label="Kapat"><i class="fa-solid fa-xmark"></i></button>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
}

const Notification = ({ message, onClear }) => {
    useEffect(() => {
        const timer = setTimeout(onClear, 3000);
        return () => clearTimeout(timer);
    }, [message, onClear]);

    return html`<div class="notification">${message}</div>`;
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    useEffect(() => {
        const handleEsc = (event) => {
           if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return html`
        <div class="modal-overlay" onClick=${onClose}>
            <div class="modal-content confirmation-modal" onClick=${e => e.stopPropagation()}>
                <div class="modal-body">
                    <p>${message}</p>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onClick=${onClose}>Cancel</button>
                        <button type="button" class="btn-danger" onClick=${onConfirm}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const App = () => {
    const [cvData, setCvData] = useState(initialCVData);
    const [activeSectionId, setActiveSectionId] = useState(null);
    const [isLandingPageEditing, setIsLandingPageEditing] = useState(false);
    const [activeTheme, setActiveTheme] = useState('default');
    const [showThemePalette, setShowThemePalette] = useState(false);
    const [notification, setNotification] = useState('');
    const [editModalState, setEditModalState] = useState({ isOpen: false, sectionId: null, item: null });
    const [confirmationState, setConfirmationState] = useState({ isOpen: false, message: '', onConfirm: () => {} });

    useEffect(() => {
        document.body.className = `theme-${activeTheme}`;
    }, [activeTheme]);

    const handleSectionClick = (id) => {
        setActiveSectionId(id);
    };

    const toggleLandingPageEdit = () => setIsLandingPageEditing(!isLandingPageEditing);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setNotification('Link panoya kopyalandı!');
        });
    };
    
    const handleAddItem = (sectionId) => {
        setEditModalState({ isOpen: true, sectionId: sectionId, item: null });
    };

    const handleEditItem = (sectionId, item) => {
        setEditModalState({ isOpen: true, sectionId: sectionId, item: item });
    };

    const handleDeleteItem = (sectionId, itemId) => {
        setConfirmationState({
            isOpen: true,
            message: 'Are you sure you want to delete this item? This action cannot be undone.',
            onConfirm: () => {
                setCvData(prevData => ({
                    ...prevData,
                    [sectionId]: prevData[sectionId].filter(item => item.id !== itemId)
                }));
                setConfirmationState({ isOpen: false, message: '', onConfirm: () => {} });
            }
        });
    };

    const handleSaveItem = (sectionId, itemToSave) => {
        setCvData(prevData => {
            const sectionData = prevData[sectionId];
            const isNew = !itemToSave.id;
            if (isNew) {
                const newItem = { ...itemToSave, id: Date.now() };
                return { ...prevData, [sectionId]: [...sectionData, newItem] };
            } else {
                const updatedSectionData = sectionData.map(item => item.id === itemToSave.id ? itemToSave : item);
                return { ...prevData, [sectionId]: updatedSectionData };
            }
        });
    };

    const menuItems = [
        { id: 'experience', label: 'Work Experiences' }, { id: 'volunteerExperience', label: 'Volunteer Experiences' },
        { id: 'education', label: 'Education' }, { id: 'skills', label: 'Skills' },
        { id: 'interests', label: 'Interests' }, { id: 'languages', label: 'Languages' },
        { id: 'references', label: 'References' }, { id: 'contactInfo', label: 'Contact' }
    ];

    const activeSection = activeSectionId ? menuItems.find(item => item.id === activeSectionId) : null;
    
    return html`
    <div class="app-container">
        <div class="top-right-controls">
            <button class="control-btn" onClick=${handleShare} aria-label="Paylaş"><i class="fa-solid fa-arrow-up-from-bracket"></i></button>
            <div class="theme-palette-container">
                <button class="control-btn" onClick=${() => setShowThemePalette(!showThemePalette)} aria-label="Tema Seç"><i class="fa-solid fa-palette"></i></button>
                ${showThemePalette && html`
                    <div class="theme-palette">
                        ${themes.map(theme => html`
                            <button class="theme-option ${activeTheme === theme.id ? 'active' : ''}" onClick=${() => { setActiveTheme(theme.id); setShowThemePalette(false); }} style=${{background: theme.gradient}}>${theme.name}</button>
                        `)}
                    </div>
                `}
            </div>
        </div>

        ${notification && html`<${Notification} message=${notification} onClear=${() => setNotification('')} />`}

        <${LandingPage} cvData=${cvData} onDataChange=${setCvData} isEditing=${isLandingPageEditing} onToggleEdit=${toggleLandingPageEdit}/>
        <${MainMenu} onSectionClick=${handleSectionClick} />
        
        <${SectionModal} 
            section=${activeSection} 
            data=${cvData} 
            onClose=${() => setActiveSectionId(null)} 
            onAddItem=${handleAddItem}
            onEditItem=${handleEditItem}
            onDeleteItem=${handleDeleteItem}
        />
        
        ${editModalState.isOpen && html`<${AddOrEditItemModal} 
            sectionId=${editModalState.sectionId}
            item=${editModalState.item}
            onSave=${handleSaveItem}
            onClose=${() => setEditModalState({isOpen: false, sectionId: null, item: null})}
        />`}

        <${ConfirmationModal} 
            isOpen=${confirmationState.isOpen}
            onClose=${() => setConfirmationState({ isOpen: false, message: '', onConfirm: () => {} })}
            onConfirm=${confirmationState.onConfirm}
            message=${confirmationState.message}
        />
    </div>
  `;
};

render(html`<${App} />`, document.getElementById('root'));